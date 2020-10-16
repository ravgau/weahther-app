const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const express= require('express');
const path= require('path');

require('dotenv').config();


const staticPath=  path.join(__dirname,"/public"); 
const app =express();
const port = process.env.PORT || 3000;

app.use(express.static(staticPath));

app.get('/location',(req,res)=>{
    if(!req.query.q){
        return res.send({error : "please provide a location"})
    }
    let location = req.query.q;
    console.log(location);
    geocode(location,(err,geoData)=>{
        if(err){
            console.log("error in getting geo locations");
            return  res.send({error : err});
        }
        res.send(geoData)
        
        })
})

app.get('/geoweather',(req,res)=>{
    if(!req.query.lat || !req.query.long){
        return res.send({error : "please provide a valid location"})
    }
    let geoData = {
                    latitude : req.query.lat,
                    longitude : req.query.long
                  }
    forecast(geoData,(err,forecastData)=>{
            if(err){
                console.log("error25",err,"dfd");
                return res.send({error : err})
            }
            console.log("fetc");
            res.send({            
                forecast: forecastData,
                location: "cuurent location"
            })
        })
    })

    app.get('/weather',(req,res)=>{
        console.log(req.query.q)
        if(!req.query.q){
            return res.send({error : "please provide a location"})
        }
        let location = req.query.q;
        geocode(location,(err,geoData)=>{

            if(err){
                return  res.send({error : err});
            }
            console.log(geoData)
            forecast(geoData,(err,forecastData)=>{
                if(err){
                    return res.send({error : err})
                }
                console.log(geoData.location,"from heaven")
                res.send({            
                    forecast: forecastData,
                    location: geoData.location
                })
            })
        })
    })

app.listen(port,()=>{
    console.log("server started");
});