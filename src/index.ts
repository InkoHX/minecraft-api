import fetch from 'node-fetch'

export type MojangServiceStatus = 'green' | 'yellow' | 'red'

export type MojangService = 'minecraft.net'
  | 'session.minecraft.net'
  | 'account.mojang.com'
  | 'authserver.mojang.com'
  | 'sessionserver.mojang.com'
  | 'api.mojang.com'
  | 'textures.minecraft.net'
  | 'mojang.com'

export interface UserProfileResponse {
  id: string;
  name: string;
  demo?: boolean;
  legacy?: boolean;
}

/**
 * The changedToAt field is a Java timestamp in milliseconds.
 */
export interface NameHistoryResponse {
  name: string;
  changedToAt?: number;
}

export interface SkinDataResponse {
  id: string;
  name: string;
  properties: [
    {
      name: string;
      value: string;
      signature?: string;
    }
  ];
}

export class MinecraftAPIError extends Error { }

export default class MinecraftAPI {
  public readonly name: string

  public uuid?: string
  public currentName?: string
  public legacy = false
  public demo = false

  public history?: NameHistoryResponse[]
  public skinData?: SkinDataResponse;

  public constructor (name: string) {
    this.name = name
  }

  public async fetchProfile (): Promise<UserProfileResponse> {
    const data = await fetch(`https://api.mojang.com/users/profiles/minecraft/${this.name}`).catch(() => null)
    if (!data) throw new MinecraftAPIError('Fetch error.')
    if (data.status !== 200) throw new MinecraftAPIError(`Status Code: ${data.status} | ${data.statusText}`)
    const profile: UserProfileResponse = await data.json()

    this.uuid = profile.id
    this.currentName = this.name
    this.demo = profile.demo || false
    this.legacy = profile.legacy || false

    return profile
  }

  public async fetchNamehistory (): Promise<NameHistoryResponse[]> {
    if (!this.uuid) throw new MinecraftAPIError()
    const data = await fetch(`https://api.mojang.com/user/profiles/${this.uuid}/names`).catch(() => null)
    if (!data) throw new MinecraftAPIError('Fetch error.')
    if (data.status !== 200) throw new MinecraftAPIError(`Status Code: ${data.status} | ${data.statusText}`)

    const nameHistory: NameHistoryResponse[] = await data.json()

    this.history = nameHistory

    return nameHistory
  }

  public async fetchSkinData (unsigned = true): Promise<SkinDataResponse> {
    if (!this.uuid) throw new MinecraftAPIError()
    const data = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${encodeURIComponent(this.uuid)}?unsigned=${unsigned}`).catch(() => null)
    if (!data) throw new MinecraftAPIError('Fetch error.')
    if (data.status === 429) throw new MinecraftAPIError('TooManyRequestsException: The client has sent too many requests within a certain amount of time')
    if (data.status !== 200) throw new MinecraftAPIError(`Status Code: ${data.status} | ${data.statusText}`)

    const profile: SkinDataResponse = await data.json()

    this.skinData = profile

    return profile
  }

  public async fetch (): Promise<void> {
    await this.fetchProfile()
    await this.fetchNamehistory()
    await this.fetchSkinData()
  }

  /**
   * Returns status of various Mojang services.
   */
  public static async getServiceStatus (): Promise<{ [key in MojangService]: MojangServiceStatus }[]> {
    const data = await fetch('https://status.mojang.com/check').catch(() => null)
    if (!data) throw new MinecraftAPIError('Fetch error.')
    if (data.status !== 200) throw new MinecraftAPIError(`Status Code: ${data.status} | ${data.statusText}`)
    const result: { [key in MojangService]: MojangServiceStatus }[] = await data.json()

    return result
  }

  /**
   * Returns a list of SHA1 hashes used to check server addresses against when the client tries to connect.
   */
  public static async getBlockedServers (): Promise<string> {
    const data = await fetch('https://sessionserver.mojang.com/blockedservers').catch(() => null)
    if (!data) throw new MinecraftAPIError('Fetch error.')
    if (data.status !== 200) throw new MinecraftAPIError(`Status Code: ${data.status} | ${data.statusText}`)

    return data.text()
  }
}
