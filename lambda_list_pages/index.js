const request = require('request');
const parseString = require('xml2js').parseString;

exports.handler = (eventUrl) => {

    let sitemapUrl = `${eventUrl}sitemap.xml`;

    console.log('sitemapUrl: ' + sitemapUrl);

    request(sitemapUrl, function (error, response, body) {
        if(error){
            console.log('error:\n', error); // Print the error if one occurred
        } else {
            console.log('statusCode:', response.statusCode);

            if(response.statusCode != 200){
                console.log('Error, no exist sitemap');
                return;
            }
            
            parseString(body, function (err, result) {

                if(err){
                    console.log('err: ' + err);
                    return
                }

                if(result.urlset == undefined)
                {
                    console.log('Error, no exist sitemap');
                    return;   
                }

                result.urlset.url.map(url => {
                    console.log(url.loc[0]);
                });
            });
        }
    });
}

exports.handler('https://www.google.com/');