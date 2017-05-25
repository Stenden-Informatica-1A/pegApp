/**
 * This code receives weather data and outputs useful was drying information.
 * The weather data is provided by Apixu (https://www.apixu.com/).
 */

$(document).ready(function(){

    ﻿var apixuKey = "c41bcf9328bc4b0c9c7100935171805";
    var Area = "auto:ip";   //get location from ip.
    var Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=7&lang=nl'; //What data is being requested.

    $.getJSON(Query, function (results) {   //Get JSON data using an AJAX request.
	
		//Homepage: weather info for today.
		
		var condition = results.forecast.forecastday[0].day.condition.code;
		var precip = results.forecast.forecastday[0].day.totalprecip_mm;
		var aHumid = results.forecast.forecastday[0].day.avghumidity;
		var mWindS = results.forecast.forecastday[0].day.maxwind_kph;
		
		if(precip < 1){
			precip = " en er is weinig kans op regen."
		}else if(precip < 4){
			precip = " en er is kans op regen.";
		}else{
			precip = " en het gaat regenen."
		}
		
		if(condition == 1000 && aHumid < 80 && mWindS > 11 && mWindS < 29){
			condition = "Dit is een perfecte dag om je was te drogen!";
		}else if(condition <= 1030 && mWindS > 11 && mWindS < 29 && aHumid < 85){
			condition = "Dit is een prima dag om je was te drogen.";
		}else if(condition <= 1030 && mWindS < 29){
			condition = "Het drogen van je was kan even duren vandaag.";
		}else{
			condition = "Pas op, neerslag of harde wind verwacht!";
		}
		
		$(".dCond").html("Vandaag is het " + results.forecast.forecastday[0].day.condition.text.toLowerCase() + precip + "<br><br><b>" + condition + "</b>");
		$(".dIcon").html("<img src='" + results.forecast.forecastday[0].day.condition.icon + "' alt='Weer icoon'>");
		$(".dAvgTemp").html(results.forecast.forecastday[0].day.avgtemp_c + " °C");
		$(".cWindDir").html(results.current.wind_dir);
		$(".cWindSpeed").html(results.current.wind_kph + " km/u");
		$(".dAvgHum").html(results.forecast.forecastday[0].day.avghumidity + " %");
		
		//Day page: Weather info per hour.
		
        var sunR = results.forecast.forecastday[0].astro.sunrise;
        var sunRise = parseInt(sunR.substring(0,2),10)+1;   //first hour of sun.
        var tr;
		
        for (i = sunRise; i < results.forecast.forecastday[0].hour.length; i++) { //filling the day weather table.
			if(i<10){
                var hour = "0"+i; 
            }else{
                hour = i;
            }
            tr = $('<tr/>');
            tr.append("<td>" + hour + ":00</td>");
            tr.append("<td><img src='" + results.forecast.forecastday[0].hour[i].condition.icon + "' alt='"+ results.current.condition.text +"'></td>");
			tr.append("<td>" + results.forecast.forecastday[0].hour[i].temp_c + " °C</td>");
			tr.append("<td>" + results.forecast.forecastday[0].hour[i].humidity + " %</td>");
			tr.append("<td>" + results.forecast.forecastday[0].hour[i].wind_kph + " km/u</td>");

            $('#tDay').append(tr);
        }
		
		//Week page: Weather info per day.
		
		var date = new Date();
		var weekday = new Array(7);
		var wText = new Array(7);
		var wIcon = new Array(7);
		var frequency = {};
		var max = sunny = cloudy = rainFall = wImg = 0;
		var tResult, iResult;
		
		weekday[0] = "Zondag";
		weekday[1] = "Maandag";
		weekday[2] = "Dinsdag";
		weekday[3] = "Woensdag";
		weekday[4] = "Donderdag";
		weekday[5] = "Vrijdag";
		weekday[6] = "Zaterdag";
		
		for (i = 0; i < results.forecast.forecastday.length; i++) { 	//filling the 'week weather table' and arrays for the general weather condition this week.
			wText.push(results.forecast.forecastday[i].day.condition.text);
			wIcon.push(results.forecast.forecastday[i].day.condition.icon);
			condition = results.forecast.forecastday[i].day.condition.code;
			if(condition == 1000){
				sunny++;
			}else if(condition <= 1030){
				cloudy++;
			}else{
				rainFall++;
			}
			
            if(i==0){
				var day = date.getDay();
			}else if(day > 6){
				day = 0;
			}
			
            tr = $('<tr/>');
            tr.append("<td>" + weekday[day] + "</td>");
            tr.append("<td><img src='" + results.forecast.forecastday[i].day.condition.icon + "' alt='Weer icoon'><br>" + results.forecast.forecastday[i].day.condition.text + "</td>");
			tr.append("<td>" + results.forecast.forecastday[i].day.avgtemp_c + " °C</td>");
			tr.append("<td>" + results.forecast.forecastday[i].day.avghumidity + " %</td>");
			tr.append("<td>" + results.forecast.forecastday[i].day.maxwind_kph + " km/u</td>");

            $('#tWeek').append(tr);
			day++;
        }
		
		if(sunny > 4){	//Calculates the weather condition for this week.
			condition = "zonnig";
		}else if(sunny > 1 && cloudy > 1 && rainFall < 2){
			condition = "zonnig met af en toe bewolking";
		}else if(sunny < 2 && cloudy > 1 && rainFall < 2){
			condition = "bewolkt";
		}else if(rainFall > 3){
			condition = "neerslag";
		}else{
			condition = "afwisselend";
		}
		
		for(var v in wText){	//Most common weather condition (text).
			frequency[wText[v]]=(frequency[wText[v]] || 0)+1;
			if(frequency[wText[v]] > max){
				max = frequency[wText[v]];
				tResult = wText[v];
			}
		}
		if(max > 3){	// Weather condition is most common if most common > 3 else calculated weather condition (text).
			$("#aText").html("Het weer van deze week is voornamelijk " + tResult.toLowerCase() + "."); 
		}else if(condition == "afwisselend"){
			$("#aText").html("Het weer van deze week is afwisselend.");
		}else{
			$("#aText").html("Het weer van deze week is voornamelijk " + condition + "."); 
		}
		max = 0;
		for(var v in wIcon){	//Most common weather condition (icon).
			frequency[wIcon[v]]=(frequency[wIcon[v]] || 0)+1;
			if(frequency[wIcon[v]] > max){
				max = frequency[wIcon[v]];
				iResult = wIcon[v];
			}
		}
		if(max > 3){	// Weather condition is most common if most common > 3, else calculated weather condition (icon).
			$("#aIcon").html("<img src='" + iResult + "' alt='Weer icoon'>");
		}else{
			switch(condition){
				case "zonnig":
					wImg =  113;
					break;
				case "zonnig met af en toe bewolking":
					wImg =  116;
					break;
				case "bewolkt":
					wImg =  122;
					break;
				case "neerslag":
					wImg =  308;
					break;
				default:
					wImg = 176;
			}
			$("#aIcon").html("<img src='//cdn.apixu.com/weather/64x64/day/" + wImg +".png' alt='Weer icoon'>");
		}
    });
});
