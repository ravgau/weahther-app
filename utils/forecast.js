const request = require('request');
require('dotenv').config();

const forecast = (geocode,callback)=>{
    let lat = Number(geocode.latitude);
    let long = Number(geocode.longitude);
    console.log(lat,long)
    const url = `https://api.darksky.net/forecast/${process.env.FORECAST}/${lat},${long}?units=si&exclude=flags`;
    request({url :url,json: true },(err,res)=>{
        if(err){
            console.log(err);
            callback("Unable to connect",undefined)
        }
        else if(res.body.error){
            console.log(res.body.error)
            callback("Unable to get weather details" + res.body.error,undefined)
        }
        else{
            console.log(res.body);
            callback(undefined, res.body);
        }
    })
}

module.exports = forecast;  
