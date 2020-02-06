const request = require('request-promise')

const defaultConfig = {
  method: 'GET',
  resolveWithFullResponse: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 Edg/79.0.309.71'
  }
}

class Request {
  static async doRequest (url, options = {}) {
    return request(url, Object.assign({}, defaultConfig, options))
  }
}

module.exports = Request