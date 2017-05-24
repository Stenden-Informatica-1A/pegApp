//Zoeken naar wasknijpers in de omgeving
function searchKnijper(){
	$(".fa-refresh").css("display","block")
	.delay(3000)
	.queue( function (next) {
		$(".gevondenDevices").css("display", "block")
		.queue( function (next) {
			$(".fa-refresh").css("display","none");
		})
	});
}




//Gegevens van de wasknijper opslaan in de database

//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

//Kijken of de telefoon indexedDB ondersteuned
if (!window.indexedDB) {
	window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

//Variabels aanmaken
const employeeData = [];
var db;
var request = window.indexedDB.open("KnijperDB", 1);

//Als de database een error geeft
request.onerror = function(event) {
	console.log("error: ");
};

//Als de database succesvol is geopent.
request.onsuccess = function(event) {
	db = event.target.result;
	//Doe iets.
};

//Als er nog geen database is gevonden.
request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("employee", {keyPath: "id"});

	for (var i in employeeData) {
		objectStore.add(employeeData[i]);
	}
}

//Gegevens uit de database lezen.
function readKnijper() {
	var transaction = db.transaction(["employee"]);
	var objectStore = transaction.objectStore("employee");
	var request = objectStore.get("00-03");

	request.onerror = function(event) {
	   alert("Unable to retrieve data from database!");
	};

	request.onsuccess = function(event) {
	   // Do something with the request.result!
	   if(request.result) {
		  alert("Name: " + request.result.name);
	   }
	   
	   else {
		  alert("Wasknijper couldn't be found in your database!");
	   }
	};
}

//Wasknijper toevoegen aan de database
function addKnijper() {
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.add({ id: "00-03", name: "Wasknijper"});

	request.onsuccess = function(event) {
	   alert("Wasknijper has been added to your database.");
	};

	request.onerror = function(event) {
	   alert("Deze wasknijper bestaat al! ");
	}
}

//Wasknijper verwijderen uit de database
function removeKnijper() {
	var request = db.transaction(["employee"], "readwrite")
	.objectStore("employee")
	.delete("00-03");

	request.onsuccess = function(event) {
	   alert("Wasknijper's entry has been removed from your database.");
	};
}
















