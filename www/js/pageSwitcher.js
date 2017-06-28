//Variables aanmaken
var page;
getPageSwipe();
footerDots();

//Zorgen dat het vegen werkt
function getPageSwipe(){
	//Kijken of er al een wasknijper is toegevoegd aan de app
	if( localStorage.getItem('knijperName') && localStorage.getItem('knijperKey') && localStorage.getItem('knijperKey') == "01" ){
		//Als de pagina veranderd verander naar pagina
		$(document).on("pagechange", function (e, data) {
			page = data.toPage[0].id;
		});
		//Bij het vegen naar links of rechts
		$(document).on('swipeleft swiperight', function (event) {
			// next page
			if (event.type == 'swipeleft' && page !="weatherWeek" && page!="settings" && page!="firstLoad") {
				var nextPage = $.mobile.activePage.next('[data-role=page]');
				if (nextPage) {
					$.mobile.changePage(nextPage, {
						transition: "slide" // or any transition
					}
				  );
				}
				activePage = $( ".selector" ).pagecontainer( "getActivePage" );
			}
			// previous page
			if (event.type == 'swiperight' && page != "main"  && page!="settings" && page!="firstLoad") {
				var prevPage = $.mobile.activePage.prev('[data-role=page]');
				if (prevPage) {
					$.mobile.changePage(prevPage, {
						transition: "slide",
						reverse: true // reverse effect
					}
				  );
				  activePage = $( ".selector" ).pagecontainer( "getActivePage" );
				}
			}
		});
	}
	else{ //Terug sturen naar de pagina om je wasknijper toe te voegen.
		window.location.href = "index.html#firstLoad";
	}
}


//De aangeef puntjes maken
function footerDots(){		
	$(document).on("pageshow", function (e, data) {
		$("#footer").remove();
		var pageDots = $.mobile.pageContainer.pagecontainer( 'getActivePage' ).attr( 'id' );
		if (pageDots=="main" || pageDots=="weatherDay" || pageDots=="weatherWeek") {
			$("body").append('<div id="footer"><div id="pageMarker"><div class="pageSelector"></div><div class="pageSelector"></div><div class="pageSelector"></div></div></div>');
			if(pageDots == "main")
			{
				$(".pageSelector:nth-child(1)").addClass("pageSelected");
				$(".pageSelector:nth-child(2)").removeClass("pageSelected");
				$(".pageSelector:nth-child(3)").removeClass("pageSelected");
			}
			else if(pageDots == "weatherDay")
			{
				$(".pageSelector:nth-child(1)").removeClass("pageSelected");
				$(".pageSelector:nth-child(2)").addClass("pageSelected");
				$(".pageSelector:nth-child(3)").removeClass("pageSelected");
			}
			else if(pageDots == "weatherWeek")
			{
				$(".pageSelector:nth-child(1)").removeClass("pageSelected");
				$(".pageSelector:nth-child(2)").removeClass("pageSelected");
				$(".pageSelector:nth-child(3)").addClass("pageSelected");
			}
		}
		else
		{
			$("#footer").remove();
		}
	});	
}


//Als er op de terug knop wordt gedrukt op de telefoon
$(document).on("backbutton", function (e){
	//Als het de hoofdpagina is
    if($.mobile.activePage.attr("id") == "main" || $.mobile.activePage.attr("id") == "firstLoad"){
		//Geef melding om af te willen sluiten
		var r = confirm("Weet u zeker dat u de app wilt afsluiten?");
		if (r == true) {
			navigator.app.exitApp();
		}
    }
	//Anders ga naar de hoofdpagina
    else{
      $.mobile.changePage("index.html", {
		transition: "slidedown"
	  });
    }
});


//De knop voor het afsluiten vd app
function alertexit(button){
	if(button=="1" || button==1){
        navigator.app.exitApp();
	}
}


// Wasknijper toevoegen
function addKnijper() {
	//Locale velden maken en zetten.
	localStorage.setItem('knijperName', document.getElementById('KnijperName').value);
	localStorage.setItem('knijperKey', document.getElementById('KnijperID').value);

	//Melding geven dat de knijper is teogevoegd.
	alert("SMART-Knijper " + localStorage.getItem('knijperName') + " is toegevoegd!");

	//Naar de homepage gaan
	$.mobile.changePage("index.html", {
		transition: "slideup"
	});
	window.location.href = "index.html";
	destroyScan();
	//test123();
}


//opgeslagen waardes van de knijper aanroepen.
function showKnijper(){
	alert( localStorage.getItem('knijperName') + ": " + localStorage.getItem('knijperKey') );
}

//Verwijderen van de gegevens
function removeKnijper(){
  //Items verwijderen
  localStorage.removeItem("knijperName");
  localStorage.removeItem("knijperKey");

  //Melding geven
  alert( "Uw SMART-Knijper is succesvol verwijderd!" );

  //Terug naar de toevoeg pagina sturen
  $.mobile.changePage("index.html#firstLoad", {
		transition: "slideup"
  });
}

//Zorgen dat de naam van de Knijper zichtbaar is in de instellingen pagina
$('#wasknijperNaam').text( localStorage.getItem('knijperName') );


//Zet instellingen juist neer
//Notificaties
//Als er nog geen instelling is gezet voor de notificaties
if( !localStorage.getItem('notificaties') ){
	localStorage.setItem('notificaties', "on");
}
//Anders de waarde van het element goed zetten gebasseerd op de opgeslagen waarde
else{
	document.getElementById('notificaties').value = localStorage.getItem('notificaties');
}
//Functie om de waarde te updaten
function changeNoti(){
	localStorage.setItem('notificaties', document.getElementById('notificaties').value );
}

//Dynamische achtergronden
//Als er nog geen instelling is gezet voor de dynamische achtergronden
if( !localStorage.getItem('dynamisch') ){
	localStorage.setItem('dynamisch', "off");
}
//Anders de waarde van het element goed zetten gebasseerd op de opgeslagen waarde
else{
	document.getElementById('dynamisch').value = localStorage.getItem('dynamisch');
}
//Functie om de waarde te updaten
function changeDyna(){
	localStorage.setItem('dynamisch', document.getElementById('dynamisch').value );
}

//Eenheden
//Als er nog geen instelling is gezet voor de eenheden
if( !localStorage.getItem('eenheid') ){
	localStorage.setItem('eenheid', "metrisch");
}
//Anders de waarde van het element goed zetten gebasseerd op de opgeslagen waarde
else if( localStorage.getItem('eenheid') == "metrisch" ){
    document.getElementById("metrisch").checked = true;
}
//Anders de waarde van het element goed zetten gebasseerd op de opgeslagen waarde
else{
    document.getElementById("imperiaal").checked = true;
}

//Functie om de waarde te updaten
function changeEenheid(){
	if( document.getElementById("metrisch").checked == true ){
		localStorage.setItem('eenheid', "metrisch");
	}
	else{
		localStorage.setItem('eenheid', "imperiaal");
	}
}
