const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express')

const app = express()
const port = 3000

const parseExample1=new Promise(async (resolve,_)=>{
    try{
        var res= await axios.get('https://en.wikipedia.org/wiki/Districts_of_Bangladesh')
        const $ = cheerio.load(res.data);
        var districts=[]
        $('.wikitable tbody tr').map((_,row)=>{
            var currDistrict=$($(row).children()[0]).find('a').text()
            if(currDistrict.length>0)districts.push(currDistrict)

        })
        resolve(districts)
    }catch(e){
        resolve('error occurred')
    }
})

const parseExample2=new Promise(async (resolve,_)=>{
    try{
        var res= await axios.get('https://scrapeme.live/shop/')
        const $ = cheerio.load(res.data);
        const pokemonNames = $('.woocommerce-loop-product__title')
            .map((_, product) => {
                return $(product).text()
            })
            .toArray();
        resolve(pokemonNames)
    }catch(e){
        resolve('error occurred')
    }
})

app.get('/scrap', async (req, res) => {
    var allResults=await Promise.all([parseExample1,parseExample2])
    res.send(allResults)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

