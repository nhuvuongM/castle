const cheerio = require('cheerio')
const axios=require('axios')


//const url = "https://www.relaischateaux.com/fr/chef/guillaume-royer"

function getRestoName(url){
  axios.get(url).then(function(response) {
    const html = response.data
    const $ = cheerio.load(html)
    var name = $('.locationContact').find('strong').text()

    //console.log(name)
    return name;
  })
  .catch(function(error){
    console.log(error)
  })
}

//getRestoName(url)


module.exports = getRestoName;
