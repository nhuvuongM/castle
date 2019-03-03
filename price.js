const cheerio = require('cheerio')
const axios=require('axios')


const url = "https://www.relaischateaux.com/fr/france/bussiere-cote-d-or-la-bussiere-sur-ouche"

function getPrice(url){
    axios.get(url).then(function(response) {
    const html = response.data
    const $ = cheerio.load(html)
    var price = $('.price').text()

    console.log(price)
    return price

  })
  .catch(function(error){
    console.log(error)
  })

}

var price = getPrice(url)

module.exports = getPrice;
