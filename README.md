# minecraft-api-node

## Install

### npm

```bash
npm install --save minecraft-api-node
```

### Yarn

```bash
yarn add minecraft-api-node
```

## Method

### fetch

```js
const MinecraftAPI = require('minecraft-api-node')
const player = new MinecraftAPI('your name')

player.fetch().then(() => {
  console.log(player.uuid)
})
```

### fetchProfile

```js
const MinecraftAPI = require('minecraft-api-node')
const player = new MinecraftAPI('your name')

player.fetchProfile().then((profile) => {
  console.log(profile)
})
```

### fetchNamehistory

```js
const MinecraftAPI = require('minecraft-api-node')
const player = new MinecraftAPI('your name')

player.fetchNamehistory((history) => {
  console.log(history)
})
```

### fetchSkinData

```js
const MinecraftAPI = require('minecraft-api-node')
const player = new MinecraftAPI('your name')

player.fetchSkinData((skindata) => {
  console.log(skindata)
})
```

## Method (static)

### getServiceStatus

```js
const MinecraftAPI = require('minecraft-api-node')

MinecraftAPI.getServiceStatus.then((status) => {
  console.log(status)
})
```

### getBlockedServers

```js
const MinecraftAPI = require('minecraft-api-node')

MinecraftAPI.getBlockedServers.then((blackservers) => {
  console.log(blackservers)
})
```
