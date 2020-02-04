require('module-alias/register')

const isImage = require('is-image-url')
const _ = require('lodash')
const cheerio = require('cheerio')
const Request = require('@shared/request')
const Logger = require('@shared/logger')

const fetchLinkBody = async linkUrl => {
  return Request.doRequest(linkUrl)
}

const linkHaveFileTypes = link => {
  const isCssOrJs = link.match(/(\.js|\.css)/gmi) != null
  return isImage(link) || isCssOrJs
}

const getAllLinks = $ => {
  return $('*[src], *[href]')
    .toArray()
    .map(el => {
      const href = $(el).attr('href')
      const src = $(el).attr('src')

      return href !== undefined ? href : src
    })
    .filter(linkHaveFileTypes)
}

exports.handler = eventUrl => {
  Logger.log('====Get all links===')

  const arrayFiles = []

  Logger.log(new URL(eventUrl))
  Request.doRequest(eventUrl, {
    timeout: 120000,
    transform: html => cheerio.load(html)
  })
    .then(
      async $ => {
        const allLinks = getAllLinks($)

        Logger.log(`List link size: ${allLinks.length} \n ====Verify links===`)

        for (const link of allLinks) {
          const hasProtocol = link.match(/^(http|https)/)

          if (!_.isEmpty(hasProtocol)) {
            Logger.log(`if: ${link}`)
            arrayFiles.push(link)
          } else {
            const newUrl = `${eventUrl}${link}`

            Logger.log(`else: ${newUrl}`)

            // This code, is really necessary?
            await fetchLinkBody(newUrl)
              .then(
                ({ statusCode }) => {
                  if (statusCode === 200) {
                    arrayFiles.push(newUrl)
                  }
                },
                err => Logger.log(err)
              )
          }
        }

        Logger.log('====Links Verified===')
        arrayFiles.forEach(fileLink => Logger.log(fileLink))
        Logger.log(arrayFiles.length)
      },
      err => Logger.log(`Error:\n ${err}`)
    )
}

exports.handler('https://www.unity.com')
