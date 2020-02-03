const request = require('request');
const cheerio = require('cheerio');
var URL = require('url');

exports.handler = (eventUrl) => {
    let arrayFiles = [];
    let arrayAllLinks = [];
    let timeout = 120000;
    let url = eventUrl;
    console.log(new URL.parse(eventUrl));
    // console.log(new URL(url));

    function linkHaveFileTypes(value){
        return value.includes('/js/') || 
                value.includes('/images/') || 
                value.includes('/css/');
    }

    request(url, {timeout: timeout}, function (error, response, body) {
        if(error){
            console.log('error:\n', error);
        } else {
            const $ = cheerio.load(body);
            console.log('code: ' + response.statusCode);
            
            console.log('====Get all links===');
            
            $( "*" ).each(function() {


                if($(this).attr("src") != undefined){
                    let value = $(this).attr("src");

                    if(linkHaveFileTypes(value)){
                        console.log(value);
                        arrayAllLinks.push(value);
                    }

                } 
                else if($(this).attr("href") != undefined){
                    let value =  $(this).attr("href");

                    if(linkHaveFileTypes(value)){
                        console.log(value);
                        arrayAllLinks.push(value);
                    }
                }
            });

            console.log(arrayAllLinks.length);


            console.log('====Verify links===');


            // Verify statusCode = 200

            arrayAllLinks.forEach(fileUrl => {
                let urlData = new URL.parse(url);
                let hostUrl = `${urlData.protocol}//${urlData.host.replace('www.', '')}`;
                console.log('hostUrl:: ' + hostUrl);

                if(fileUrl.includes(url)){
                    console.log('if: ' + fileUrl);
                    arrayFiles.push(fileUrl);
                } else {
                    let newUrl = '';

                    if(fileUrl.includes(hostUrl))
                        newUrl = fileUrl;
                    else
                        newUrl = `${hostUrl}${fileUrl}`;

                    console.log('else: ' + newUrl);

                    request(newUrl, {timeout: timeout}, function (error, response, body) {
                        if(error){
                            console.log(error);
                            return;
                        }

                        console.log('status code: ' + response.statusCode);
                        if(response.statusCode == 200)
                            arrayFiles.push(newUrl);
                    });
                }
            });


            setTimeout(() => {
                console.log('====Links Verified===');
                arrayFiles.forEach(fileLink => {
                    console.log(fileLink);
                });
    
                console.log(arrayFiles.length);
            }, 5000);

        }
    });
};

exports.handler('https://www.unity.com/');