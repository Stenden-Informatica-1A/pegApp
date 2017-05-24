/**
 * This code receives weather data and outputs useful was drying information for today.
 * The data is provided by Apixu (https://www.apixu.com/).
 */

$(document).ready(function(){

    ﻿var apixuKey = "c41bcf9328bc4b0c9c7100935171805";
    var Area = "auto:ip";   //get location from ip.
    var Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=1'; //what to request from weather json

    $.getJSON(Query, function (results) {   //Get JSON data using an AJAX request.
        var sunr = results.forecast.forecastday[0].astro.sunrise;
        var sunrise = parseInt(sunr.substring(0,2),10)+1;   //first hour of sun.
         
        var tr;
        for (i = sunrise; i < results.forecast.forecastday[0].hour.length; i++) { //filling the weather table.
            if(i<10){
                var hour = "0"+i; 
            }else{
                hour = i;
            }
            tr = $('<tr/>');
            tr.append("<td>" + hour + ":00</td>");
            tr.append("<td><img src='" + results.forecast.forecastday[0].hour[i].condition.icon + "' alt='weather icon'></td>");
            tr.append("<td>" + results.forecast.forecastday[0].hour[i].wind_kph + " km/h</td>");
            tr.append("<td>" + results.forecast.forecastday[0].hour[i].temp_c + " °C</td>");
            $('table').append(tr);
        }
    });
});
