var page;

if( localStorage.getItem('knijperName') && localStorage.getItem('knijperKey') && localStorage.getItem('knijperKey') == "01" ){
	$(document).on("pagechange", function (e, data) {
		page = data.toPage[0].id;
	});
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

$(document).on("backbutton", function (e){
    if($.mobile.activePage.attr("id") == "main"){
		navigator.notification.confirm("Are you sure you want to exit ?", alertexit, "Confirmation", "Yes,No"); 
    }
    else{
      $.mobile.changePage("index.html", {
		transition: "slidedown"
	  });
    }
});


function alertexit(button){
	if(button=="1" || button==1){
        navigator.app.exitApp();
	}
}


// Wasknijper toevoegen
function addKnijper() {
  localStorage.setItem('knijperName', document.getElementById('KnijperName').value);
  localStorage.setItem('knijperKey', document.getElementById('KnijperID').value);
    
  alert("SMART-Knijper " + localStorage.getItem('knijperName') + " is toegevoegd!");
  $.mobile.changePage("index.html", {
		transition: "slideup"
  });
}


//opgeslagen waardes van de knijper aanroepen.
function showKnijper(){
	alert( localStorage.getItem('knijperName') + ": " + localStorage.getItem('knijperKey') );
}

//Verwijderen van de gegevens
function removeKnijper(){
  localStorage.removeItem("knijperName");
  localStorage.removeItem("knijperKey");
  
  alert( "Uw SMART-Knijper is succesvol verwijderd!" );
  $.mobile.changePage("index.html#firstLoad", {
		transition: "slideup"
  });
}

//Zorgen dat de naam van de Knijper zichtbaar is in de instellingen pagina
$('#wasknijperNaam').text( localStorage.getItem('knijperName') );


//Zet instellingen juist neer
//Notificaties
if( !localStorage.getItem('notificaties') ){
	localStorage.setItem('notificaties', "off");
}
else{
	document.getElementById('notificaties').value = localStorage.getItem('notificaties');
}
function changeNoti(){
	localStorage.setItem('notificaties', document.getElementById('notificaties').value );
}

//Dynamische achtergronden
if( !localStorage.getItem('dynamisch') ){
	localStorage.setItem('dynamisch', "off");
}
else{
	document.getElementById('dynamisch').value = localStorage.getItem('dynamisch');
}
function changeDyna(){
	localStorage.setItem('dynamisch', document.getElementById('dynamisch').value );
}

//Eenheden
if( !localStorage.getItem('eenheid') ){
	localStorage.setItem('eenheid', "metrisch");
}
else if( localStorage.getItem('eenheid') == "metrisch" ){
    document.getElementById("metrisch").checked = true;
}
else{
    document.getElementById("imperiaal").checked = true;
}

function changeEenheid(){
	if( document.getElementById("metrisch").checked == true ){
		localStorage.setItem('eenheid', "metrisch");
	}
	else{
		localStorage.setItem('eenheid', "imperiaal");
	}
}





