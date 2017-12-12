// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const sharedConfig = require('./shared.js')

module.exports = merge(sharedConfig, {})
describe('default', () => {
    it('adds that 1 and 3 make 4', () => {
      expect(1+3).toBe(4);
    });
});