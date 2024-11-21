const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const juice = require('juice');
const { clearScreenDown } = require('readline');
const format = require('html-format');
const cssStyles = fs.readFileSync('styles.css').toString();
//console.log(cssStyles);


async function getTable() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: 'GET',
        url: 'https://www.xtralease.com/services/trailer-moves',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
    })

    // parsing the HTML source of the target web page with Cheerio
    const $ = cheerio.load(axiosResponse.data);

    //replace <h5> text with current date time
    const d = new Date();
    $('h5').text('Data as of ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' CT');
    $('h5').addClass('dateTime');

    //add header text to Request Trailer row
    $('th:nth-child(9)').text('Make Request');
    
    
    //convert object to raw HTML
    const htmlElement = $('.trailer-move__results').html();

    const inlinedHTML = juice.inlineContent(htmlElement,cssStyles);
    //console.log(juicy);

    //add domain to links
    const updatedHTML = inlinedHTML.replaceAll('/services', 'https://www.xtralease.com/services');

    //clean up HTML
    const cleanHTML = format(updatedHTML);

    //write HTML to file
        fs.writeFile('table.html', cleanHTML, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('success!');
        }
      });
    
    //write to DOM
    //document.getElementById("emailContent").innerHTML = "123456";
}

module.exports = {getTable};