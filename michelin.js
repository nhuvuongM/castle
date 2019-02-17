const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')


// step 1 : Get all the URLs of starred restaurant

const url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin"

function getAllURL(url){
  var listURL = []
  listURL[0] = url

  for(var i = 1; i<35; i++){
    listURL[i] = url + '/page-'+ (i+1).toString()
  }

  return listURL;
}

const listAllURL = getAllURL(url)

// step 2 : create a function to get all restaurant's name

function getAllResto(listAllURL){

  var listAllResto = []
  var listTemp = []

  //for each url, we scrap the page
  for (var i = 0; i < listAllURL.length; i ++){
    axios.get(listAllURL[i]).then(function (response) {
      const html = response.data
      const $ = cheerio.load(html)
      var info = $('div .poi_card-display-title')

      info.each( (k, el) => {
        var restoName = $(el).text();
        restoName = restoName.replace(/\s\s+/g, '');
        listTemp[k]={restoName}
        //console.log(listTemp[k])
      })

      for(var j = 0; j < listTemp.length; j ++){
        listAllResto.push(listTemp[j])
      }

      //the following line allows us to check the number of scrapping restaurant's name
      //console.log(listAllResto.length)

      //create the JSON file
      var obj = {
        listOfResto:[]
      }

      for (var i = 0; i < listAllResto.length; i ++){
        obj.listOfResto.push(listAllResto[i])
        var data = JSON.stringify(obj, null, 2)
        fs.writeFileSync('listRestoMichelin.json', data)
      }

    })
    .catch(function (error) {
      console.log(error)
    })
  }
}

const res = getAllResto(listAllURL)
module.exports = getAllResto
