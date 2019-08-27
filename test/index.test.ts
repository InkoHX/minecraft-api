import mocha, { it } from 'mocha'
import assert from 'assert'
import MinecraftAPI, { NameHistoryResponse, SkinDataResponse } from '../src'

const describe = mocha.describe

describe('MinecraftAPI tests', () => {
  describe('MinecraftAPI', () => {
    const minecraft = new MinecraftAPI('HydraParrot')
    let uuid: string
    let currentName: string
    let history: NameHistoryResponse[]
    let skinData: SkinDataResponse

    it('Method: fetchProfile', async () => {
      const res = await minecraft.fetchProfile()
      assert.strictEqual(typeof res.name, 'string')
      currentName = res.name
      assert.strictEqual(typeof res.id, 'string')
      uuid = res.id
      if (res.demo) assert.strictEqual(typeof res.demo, 'boolean')
      if (res.legacy) assert.strictEqual(typeof res.legacy, 'boolean')
    })

    it('Method: fetchNamehistory', async () => {
      const res = await minecraft.fetchNamehistory()
      res.map((value) => {
        assert.strictEqual(typeof value.name, 'string')
        if (value.changedToAt) assert.strictEqual(typeof value.changedToAt, 'number')
      })
      history = res
    })

    it('Method: fetchSkinData', async () => {
      const res = await minecraft.fetchSkinData()
      assert.strictEqual(typeof res.id, 'string')
      assert.strictEqual(typeof res.name, 'string')
      res.properties.map((value) => {
        assert.strictEqual(typeof value.name, 'string')
        assert.strictEqual(typeof value.value, 'string')
        if (value.signature) assert.strictEqual(typeof value.signature, 'string')
      })
      skinData = res
    })

    it('Property: uuid', () => {
      assert.strictEqual(typeof minecraft.uuid, 'string')
      assert.strictEqual(minecraft.uuid, uuid)
    })

    it('Property: currentName', () => {
      assert.strictEqual(typeof minecraft.currentName, 'string')
      assert.strictEqual(minecraft.currentName, currentName)
    })

    it('Property: history', () => {
      assert.strictEqual(typeof minecraft.history !== 'undefined', true)
      assert.strictEqual(minecraft.history, history)
    })

    it('Property: skinData', () => {
      assert.strictEqual(typeof minecraft.skinData !== 'undefined', true)
      assert.strictEqual(minecraft.skinData, skinData)
    })
  })

  describe('MinecraftAPI: static', () => {
    it('Method: getServiceStatus', () => {
      // TODO
    })

    it('Method: getBlockedServers', async () => {
      const value = await MinecraftAPI.getBlockedServers()
      assert.strictEqual(typeof value, 'string')
    })
  })
})
