require('module-alias/register')

const parseString = require('xml2js').parseString
const Request = require('@shared/request')
const Logger = require('@shared/logger')

exports.handler = eventUrl => {
  eventUrl = eventUrl.endsWith('/') ? eventUrl : `${eventUrl}/`
  const siteMapUrl = `${eventUrl}sitemap.xml`
  const parseBodyXml = body => {
    return parseString(body, function (err, result) {
      if (err) {
        return Logger.log(`Error:\n ${err}`)
      }

      if (result === undefined) {
        return Logger.log('Error, sitemap doesn\'t exists')
      }

      if(result.urlset == undefined){
        Logger.log(result.sitemapindex)
        let {sitemap} = result.sitemapindex
        sitemap.map(({ loc }) => console.log(loc[0]))
      } else{ // result.sitemapindex
        Logger.log(result.urlset)
        let {url} = result.urlset
        url.map(({ loc }) => console.log(loc[0]))
      }
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

exports.handler('https://ismaelnascimento.com/')
