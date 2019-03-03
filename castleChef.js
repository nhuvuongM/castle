const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const getName = require('./nameResto')
//const getPrice = require('./price')
//const getRestoName = require('./restoName')


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

    var countResponse= 0

    info.each((i, el) =>{
        var castleName= $(el).find('a').eq(0).text();
        castleName = castleName.replace(/\s\s+/g, '');
        var urlCastle= $(el).find('a').eq(0).attr('href');
        var chef=$(el).find('a').eq(1).text();
        chef = chef.replace(/\s\s+/g, '');
        var urlChef=$(el).find('a').eq(1).attr('href');

        listCastle[i]={castleName,urlCastle,chef, urlChef}

        console.log("listCastle.length: " + listCastle.length)

        if(urlChef == null){
          console.log("url null")
          countResponse+=2
          console.log("count response : " + countResponse)

        }

        //in case urlChef not null
        else{

          axios.get(urlChef).then(function (response) {
            console.log(urlChef)
            const html = response.data
            const $ = cheerio.load(html)
            var name = $('.locationContact').find('strong').text()
            listCastle[i].restoName = name;

            countResponse++

            console.log("count response1 : " + countResponse)
            console.log("listcastle length : " + 2*listCastle.length)

            if(countResponse==2*(listCastle.length)){
              console.log("vbermbgse")
              console.log(listCastle)
              toJSON(listCastle)
            }

          })
          .catch(function(error){
            console.log(error)
            countResponse++;
          })


          axios.get(urlCastle).then(function (response) {
            console.log(urlCastle)
            const html = response.data
            const $ = cheerio.load(html)
            var price = $('.price').text()
            listCastle[i].price = price;

            countResponse++

            console.log("count response2 : " + countResponse)
            console.log("listcastle length : " + 2*listCastle.length)

            if(countResponse==2*(listCastle.length)){
              console.log("vbermbgse")
              console.log(listCastle)
              toJSON(listCastle)
            }
          })
          .catch(function(error){
            console.log(error)
            countResponse++
          })

        }

    })
    //console.log(listCastle)
  })
  .catch(function(error) {
    console.log(error)
  })
}

getCastleChef(url)

module.exports = getCastleChef;
