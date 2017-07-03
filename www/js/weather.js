/**
 * This code first decides the location and then receives the weather data for that location and outputs useful wash drying information.
 * The weather data is provided by Apixu (https://www.apixu.com/).
 * Author: Gert Jan Boertien.
 */

$(document).ready(function(){
	
	﻿var apixuKey = "c41bcf9328bc4b0c9c7100935171805";
	var Area, Query, timeOut;
	var counter = 0;
	if(localStorage.getItem("count") === null){
	}else{
		counter = localStorage.getItem("count");
	}	
	localStorage.setItem("count",counter);
	
	//if there's a location stored use that, if not get a location.
	if(localStorage.getItem("loc") === null){
		getLocation();
		//Request location from device.
		function getLocation(){
			if(localStorage.getItem("count")==0){
				timeOut = 600000;
			}else{
				timeOut =  5000;
			}
			navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 0, timeout: timeOut, enableHighAccuracy: true });
			
			//if succesfull: Get the location and send the query for JSON request.
			function onSuccess(position) {
			 Area = position.coords.latitude.toString() + "," + position.coords.longitude.toString();
			 Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=7&lang=nl'; 
			 sendJson(Query);
			}
			//if unsucesfull use IP for location instead.
			function onError(error){
				//First time is just a request for GPS, second time it actually goes to IP location.
				if(localStorage.getItem("count") == 0){
					counter++;
					localStorage.setItem("count",counter);
				}else{
					counter = localStorage.getItem("count");
					counter++;
					localStorage.setItem("count",counter);
				}
				if(localStorage.getItem("count") == 1){
					alert("Voor nauwkeurige weer gegevens van uw was ophang locatie, dient u uw GPS aan te zetten. \n \n(Ga naar Instellingen om uw locatie te wijzigen.)");
					counter++;
					localStorage.setItem("count",counter);	
				}else{
					alert("Geen GPS gevonden! \n Uw IP Locatie zal worden gebruikt, dit kan onnauwkeurig zijn!");
					Area = "auto:ip";
					Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=7&lang=nl'; 
					sendJson(Query);
				}
			}
		}
	}else{
		Area = localStorage.getItem("loc");
		Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=7&lang=nl'; 
		sendJson(Query);

	}
	//If the location gets manually changed, use that instead.
	document.getElementById("locButton").onclick = function(){
		var newLoc = document.getElementById("location").value;
		localStorage.setItem("loc",newLoc);
		alert("Nieuwe locatie opgeslagen!");
		Area = localStorage.getItem("loc");
		Query = 'http://api.apixu.com/v1/forecast.json?key=' + apixuKey + '&q=' + Area + '&days=7&lang=nl';
		sendJson(Query);
	}
	//Search again for the location, GPS or IP, when the button is pressed.
	document.getElementById("gpsButton").onclick = function(){
		alert("Nieuwe locatie aangevraagd!\n\nHet ophalen van de gegevens kan enkele seconden duren.");
		getLocation();
	}
	
	//Get JSON data using an AJAX request.
	function sendJson(Query){
		$.getJSON(Query, function (results) {
			var eenheid;
			
			//Use either metric or imperial, reads unit input from settings or localstorage.
			if(localStorage.getItem("unit") === null){
				eenheid = document.querySelector('input[name = "eenheid"]').value;
			}else{
				eenheid = localStorage.getItem("unit")
			}
			
			//Change the units if the unit button is changed.
			var radios = document.forms["settingForm"].elements["eenheid"];
			for(var i = 0, max = radios.length; i < max; i++) {
				radios[i].onclick = function() {
					if(document.getElementById("metrisch").checked){
						eenheid = "metrisch";
						localStorage.setItem("unit",eenheid);
						getWeather();
					}else if(document.getElementById("imperiaal").checked){
						eenheid = "imperiaal";
						localStorage.setItem("unit",eenheid);
						$("#tDay").empty();
						getWeather();
					}
				}
			}	
			
			/**
			 * This function gets all the right weather information and displays it in the right place on the app
			 */
			getWeather();
			function getWeather(){
				
				/**
				* Homepage: weather info for today.
				*/
				
				var condition = results.forecast.forecastday[0].day.condition.code;
				var aHumid = results.forecast.forecastday[0].day.avghumidity;
				var mWindS = results.forecast.forecastday[0].day.maxwind_kph;
				var location = results.location.name;
				
				//Stores the location and displays it in Settings.
				localStorage.setItem("loc",location);
				document.getElementById("location").value = document.getElementById("location").defaultValue=location;
				
				//Turns weather conditions into wash condition.
				if(condition == 1000 && aHumid < 80 && mWindS > 11 && mWindS < 29){
					condition = "Dit is een perfecte dag om je was te drogen!";
				}else if(condition <= 1030 && mWindS > 11 && mWindS < 29 && aHumid < 85){
					condition = "Dit is een prima dag om je was te drogen.";
				}else if(condition <= 1030 && mWindS < 29){
					condition = "Het drogen van je was kan even duren vandaag.";
				}else if(condition <= 1030 && mWindS > 28){
					condition = "Pas op, harde wind verwacht!";
				}else if(mWindS > 28){
					condition = "Pas op, harde wind en neerslag verwacht!";
				}else{
					condition = "Pas op, neerslag verwacht!";
				}

				//Output for the top part of the app.
				$(".today").html(location + " vandaag");
				$(".dCond").html("Het weer van vandaag: " + results.forecast.forecastday[0].day.condition.text  + ".<br><br><b>" + condition + "</b>");
				$(".weatherIcon").html("<img src='img/" + results.forecast.forecastday[0].day.condition.icon.substring(30) + "' alt='Weer icoon'>");
				if(eenheid == "metrisch"){
					$(".dAvgTemp").html(results.forecast.forecastday[0].day.avgtemp_c + " °C");
					$(".cWindSpeed").html(results.current.wind_kph + " km/u");
				}else if(eenheid == "imperiaal"){
					$(".dAvgTemp").html(results.forecast.forecastday[0].day.avgtemp_f + " °F");
					$(".cWindSpeed").html(results.current.wind_mph + " mp/h");
				}
				$(".dAvgHum").html(results.forecast.forecastday[0].day.avghumidity + " %");

				/**
				* Day page: Weather info per hour.
				*/

				var sunR = results.forecast.forecastday[0].astro.sunrise;
				var sunRise = parseInt(sunR.substring(0,2),10)+1;   //first hour of sun.
				var tr, j;
				var ampm = "AM";

				//filling the day weather table.
				$("#tDay").html("<tr><th>Uur</th><th>Weer</th><th>Temp</th><th>Wind</th></tr>");
				for (i = sunRise; i < results.forecast.forecastday[0].hour.length; i++) { 
					//hours
					if(eenheid == "imperiaal"){
						j = i;
						if(i>12){
							j = i - 12;
							ampm = "PM";
						}
						if(j<10){
							var hour = "0"+j;
						}else{
							hour = j;
						}
					}else if(eenheid == "metrisch"){
						if(i<10){
							var hour = "0"+i;
						}else{
							hour = i;
						}
					}
					tr = $('<tr/>');
					if(eenheid == "metrisch"){
						tr.append("<td>" + hour + ":00</td>");
					}else if(eenheid == "imperiaal"){
						tr.append("<td>" + hour + ":00 " + ampm +"</td>");
					}
					//image
					tr.append("<td><img src='img/" + results.forecast.forecastday[0].hour[i].condition.icon.substring(30) + "' alt='"+ results.current.condition.text +"'></td>");
					//temperature and windspeed
					if(eenheid == "metrisch"){
						tr.append("<td>" + results.forecast.forecastday[0].hour[i].temp_c + " °C</td>");
						tr.append("<td>" + results.forecast.forecastday[0].hour[i].wind_kph + " km/u</td>");
					}else if(eenheid == "imperiaal"){
						tr.append("<td>" + results.forecast.forecastday[0].hour[i].temp_f + " °F</td>");
						tr.append("<td>" + results.forecast.forecastday[0].hour[i].wind_mph + " mp/h</td>");
					}
					$('#tDay').append(tr);
				}

				/**
				* Week page: Weather info per day.
				*/

				var date = new Date();
				var weekday = new Array(7);
				var wText = new Array(7);
				var wIcon = new Array(7);
				var frequency = {};
				var max = sunny = cloudy = rainFall = wImg = 0;
				var tResult, iResult, dates, cDate;

				$("#week").html(location + " week overzicht");

				weekday[0] = "Zondag";
				weekday[1] = "Maandag";
				weekday[2] = "Dinsdag";
				weekday[3] = "Woensdag";
				weekday[4] = "Donderdag";
				weekday[5] = "Vrijdag";
				weekday[6] = "Zaterdag";

				//filling the 'week weather table' and arrays for the general weather condition this week.
				$("#tWeek").html("<tr><th>Dag</th><th>Weer</th><th>Temp.</th><th>Luchtvocht.</th><th>Wind</th></tr>");
				for (i = 0; i < results.forecast.forecastday.length; i++) {		
					//condition arrays 
					wText.push(results.forecast.forecastday[i].day.condition.text);
					wIcon.push(results.forecast.forecastday[i].day.condition.icon);

					//get the condition and translate it in either sun, cloud or rain.
					condition = results.forecast.forecastday[i].day.condition.code;
					if(condition == 1000){
						sunny++;
					}else if(condition <= 1030){
						cloudy++;
					}else{
						rainFall++;
					}

					//gets the current day and goes through them all in order.
					if(i==0){
						var day = date.getDay();
					}else if(day > 6){
						day = 0;
					}
					
					//the full date notation.
					dates = new Date();
					dates.setDate(date.getDate()+i);
					cDate = dates.getDate() + '-'+ (dates.getMonth()+1) +'-'+dates.getFullYear();

					//the output for the table.
					tr = $('<tr/>');
					//Date days
					tr.append("<td>" + weekday[day] +"<br>"+ cDate + "</td>");
					//condition image and text.
					tr.append("<td><img src='img/" + results.forecast.forecastday[i].day.condition.icon.substring(30) + "' alt='Weer icoon'><br>" + results.forecast.forecastday[i].day.condition.text + "</td>");
					//temp, humid, windspeed.
					if(eenheid == "metrisch"){
						tr.append("<td>" + results.forecast.forecastday[i].day.avgtemp_c + " °C</td>");
						tr.append("<td>" + results.forecast.forecastday[i].day.avghumidity + " %</td>");
						tr.append("<td>" + results.forecast.forecastday[i].day.maxwind_kph + " km/u</td>");
					}else if(eenheid == "imperiaal"){
						tr.append("<td>" + results.forecast.forecastday[i].day.avgtemp_f + " °F</td>");
						tr.append("<td>" + results.forecast.forecastday[i].day.avghumidity + " %</td>");
						tr.append("<td>" + results.forecast.forecastday[i].day.maxwind_mph + " mp/h</td>");
					}

					$('#tWeek').append(tr);
					day++;
				}

				//Calculates the general weather condition for this week.
				if(sunny > 4){	
					condition = "Zonnig";
				}else if(sunny > 1 && cloudy > 1 && rainFall < 2){
					condition = "Zonnig met af en toe bewolking";
				}else if(sunny < 2 && cloudy > 1 && rainFall < 2){
					condition = "Bewolkt";
				}else if(rainFall > 3){
					condition = "Neerslag";
				}else{
					condition = "Afwisselend";
				}

				//Most common weather condition (text).
				for(var v in wText){	
					frequency[wText[v]]=(frequency[wText[v]] || 0)+1;
					if(frequency[wText[v]] > max){
						max = frequency[wText[v]];
						tResult = wText[v];
					}
				}
				max = 0;
				//Most common weather condition (icon).
				for(var v in wIcon){	
					frequency[wIcon[v]]=(frequency[wIcon[v]] || 0)+1;
					if(frequency[wIcon[v]] > max){
						max = frequency[wIcon[v]];
						iResult = wIcon[v];
					}
				}
				// General weather week condition. Depending on whether to use the most common or calculated weather (text).
				if(max > 3){	
					$("#aText").html("Het weer van deze week: " + tResult + ".");
				}else if(condition == "afwisselend"){
					$("#aText").html("Het weer van deze week: Afwisselend.");
				}else{
					$("#aText").html("Het weer van deze week: " + condition + ".");
				}

				
				// General weather week condition. Depending on whether to use the most common or calculated weather (icon).
				if(max > 3){	
					$("#aIcon").html("<img src='img/" + iResult.substring(30) + "' alt='Weer icoon'>");
				}else{
					switch(condition){
						case "Zonnig":
							wImg =  113;
							break;
						case "Zonnig met af en toe bewolking":
							wImg =  116;
							break;
						case "Bewolkt":
							wImg =  122;
							break;
						case "Neerslag":
							wImg =  308;
							break;
						default:
							wImg = 176;
					}
					$("#aIcon").html("<img src='img/day/" + wImg +".png' alt='Weer icoon'>");
				}

				//Will it rain the next hour
				date = new Date();
				var hour = date.getHours()+1;

				var warning = results.forecast.forecastday[0].hour[hour].will_it_rain;
			}
		}).fail( function(d, textStatus, error) {
			//Error message for when requesting weather data goes wrong.
			var melding = "Error bericht:";
			if(textStatus == "parsererror"){
				melding = "De weerstation is niet berijkbaar, probeer het a.u.b. later opnieuw.";
			}
			if(error == "Bad Request"){
				error = "Ongeldige locatie, voer a.u.b. een andere locatie in. Zie settings"
			}
			$(".today").html("Error!");
			$("#week").html("Error!");
			$("#aText").html(d+"<br>"+melding+"<br>"+error+".");
			$(".dCond").html("Er kunnen geen weer gegevens worden opgehaald! ("+textStatus+".)<br><br>"+error+".");
			$(".weatherIcon").html("<img src='img/night/200.png' alt='Error'>");
			$("#aIcon").html("<img src='img/night/200.png' alt='Error'>");
		});
	}
});
