'use strict';
const
    bodyParser = require('body-parser'),
    config = require('config'),
    express = require('express'),
    request = require('request');

var app = express();
var port = process.env.PORT || process.env.port || 5000;
app.set('port',port);
//use body parsing middleware
app.use(bodyParser.json());
app.listen(app.get('port'),function(){
    console.log('[app.listen]Node app is running on port',app.get('port'));
});
module.exports = app;

const WEATHER_APP_ID = config.get('weather_app_id');

//主程式運作邏輯
app.post('/webhook', function(req, res){
    let data = req.body;
    let queryDate = data.queryResult.parameters.date;
    let queryCity = data.queryResult.parameters["geo-city"];
    //Go to OpenWeatherMap to get weather data
    let propertiesObject = {
        q:queryCity,
        APPID:WEATHER_APP_ID,
        units:"metric"
    };
    request({
          uri:"https://api.openweathermap.org/data/2.5/weather",
          json:true,
          qs:propertiesObject
        },function(error, response, body){
        if(!error && response.statusCode ==200){
            //Send back the weather result
            res.json({fulfillmentText:"The weather in "+ queryCity + 
                        " is " + body.weather[0].description + 
                        ". And the temperature is around " + body.main.temp});
        }else{
            console.log("[OpenWeatherMap] failed");
        }
    });
});