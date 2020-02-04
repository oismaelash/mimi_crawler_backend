require('module-alias/register')

const parseString = require('xml2js').parseString
const Request = require('@shared/request')
const Logger = require('@shared/logger')

exports.handler = eventUrl => {
  const siteMapUrl = `${eventUrl}sitemap.xml`
  const parseBodyXml = body => {
    return parseString(body, function (err, { sitemapindex: { sitemap } }) {
      if (err) {
        return Logger.log(`Error:\n ${err}`)
      }

      if (sitemap === undefined) {
        return Logger.log('Error, sitemap doesn\'t exists')
      }

      sitemap.map(({ loc }) => console.log(loc[0]))
    })
  }

  Logger.log('sitemapUrl: ' + siteMapUrl)

  Request.doRequest(siteMapUrl)
    .then(
      response => {
        const { statusCode, body } = response

        Logger.log(`statusCode: ${statusCode}`)

        if (statusCode === 200) {
          return parseBodyXml(body)
        }

        Logger.log('Error, sitemap doesn\'t exists')
      },
      err => Logger.log(`Error:\n ${err}`)
    )
}

exports.handler('https://www.google.com/')
