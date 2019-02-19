const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const getName = require('./nameResto')
const getPrice = require('./price')

// step 1 : get all castles' name + castle url + chef's name + chef url + associated resto

const url  = "https://www.relaischateaux.com/fr/site-map/etablissements"


function toJSON(listCastle){
  var obj = {
    castleChef:[]
  }
  for (var i = 0; i < listCastle.length; i ++){
    obj.castleChef.push(listCastle[i])
    var data = JSON.stringify(obj, null, 2)
    fs.writeFileSync('listCastle.json', data)
  }
}


function getCastleChef(url){
  var listCastle = []
  axios.get(url).then(function (response) {
    const html = response.data
    const $ = cheerio.load(html)
    var info = $('#countryF').eq(1).find('li')
    var countResponse= 1

    info.each((i, el) =>{

        var castleName= $(el).find('a').eq(0).text();
        castleName = castleName.replace(/\s\s+/g, '');
        var urlCastle= $(el).find('a').eq(0).attr('href');
        var chef=$(el).find('a').eq(1).text()
        chef = chef.replace(/\s\s+/g, '');
        var urlChef=$(el).find('a').eq(1).attr('href');

        listCastle[i]={castleName,urlCastle,chef, urlChef}
        console.log(urlChef)

        if(urlChef == null){
          countResponse++
          console.log("listcastle length : " + listCastle.length)

        }
        else{

          axios.get(urlChef).then(function (response) {
            const html = response.data
            const $ = cheerio.load(html)
            var name = $('.locationContact').find('strong').text()
            listCastle[i].restoName = name;

            countResponse++

            console.log("count response : " + countResponse)
            console.log("listcastle length : " + listCastle.length)

          if(countResponse==listCastle.length){
            console.log("mjbserg")
            console.log(listCastle)
            toJSON(listCastle)
          }

        })
        .catch(function(error){
          console.log(error)
        })}
    })
    //console.log(listCastle)
  })
  .catch(function(error) {
    console.log(error)
  })
}

getCastleChef(url)

module.exports = getCastleChef;
