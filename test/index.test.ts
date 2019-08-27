import mocha from 'mocha'
import assert from 'assert'
import MinecraftAPI from '../src';

const describe = mocha.describe

describe('MinecraftAPI tests', () => {
  describe('MinecraftAPI: Not wrong name', () => {
    const minecraft = new MinecraftAPI('HydraParrot')

    it('Method: fetchProfile', () => {
      return minecraft.fetchProfile().then((res) => {
        assert.strictEqual(typeof res.name, 'string')
        assert.strictEqual(typeof res.id, 'string')
      })
    })

    it('Method: fetchNamehistory', () => {
      return minecraft.fetchNamehistory().then((res) => {
        res.map((value) => {
          assert.strictEqual(typeof value.name, 'string')
          if (value.changedToAt) assert.strictEqual(typeof value.changedToAt, 'number')
        })
      })
    })

    it('Method: fetchSkinData', () => {
      return minecraft.fetchSkinData().then((res) => {
        assert.strictEqual(typeof res.id, 'string')
        assert.strictEqual(typeof res.name, 'string')
        res.properties.map((value) => {
          assert.strictEqual(typeof value.name, 'string')
          assert.strictEqual(typeof value.value, 'string')
        })
      })
    })
  })

  describe('MinecraftAPI: static', () => {
    it('Method: getServiceStatus', () => {
      // TODO
    })

    it('Method: getBlockedServers', () => {
      return MinecraftAPI.getBlockedServers().then((value) => {
        assert.strictEqual(typeof value, 'string')
      })
    })
  })
})
