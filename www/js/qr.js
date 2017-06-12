var flash = false;

function scan_now()
{
    // For the best user experience, make sure the user is ready to give your app 
    // camera access before you show the prompt. On iOS, you only get one chance. 
 
    QRScanner.prepare(onDone); // show the prompt 
 
    function onDone(err, status){
        if (err)
        {
            // here we can handle errors and clean up any loose ends. 
            alert(err);
        }
        if (status.authorized)
        {
			//Maak het scan blokje zichtbaar
			$( ".scanBGwrapper" ).css( "display", "block" );
			$( ".ui-content.wrapper" ).css( "display", "none" );
			$( ".ui-content.wrapper.toggleBtntime" ).css( "display", "block" );
			
			
            // alert("authorized");
            // W00t, you have camera access and the scanner is initialized. 
            // QRscanner.show() should feel very fast.
            QRScanner.show();

            QRScanner.scan(displayContents);

            function displayContents(err, text)
            {
                if (err) {
                    alert("error scan");
                    // an error occurred, or the scan was canceled (error code `6`) 
                } 
				else {
					var result = text;
					result = result.split(':');
					if( result.length == 6){
						$("#KnijperName").val( text );
						addKnijper();
					}
					else{
						alert( text + " is geen Sunny!" );
						destroyScan();
					}
                }
            }
        }
        else if (status.denied)
        {
            alert("denid");
            // The video preview will remain black, and scanning is disabled. We can 
            // try to ask the user to change their mind, but we'll have to send them 
            // to their device settings with `QRScanner.openSettings()`. 
        }
        else
        {
            alert("else other");
            // we didn't get permission, but we didn't get permanently denied. (On 
            // Android, a denial isn't permanent unless the user checks the "Don't 
            // ask again" box.) We can ask again at the next relevant opportunity. 
        }
    }
}

//Zet de camera weer uit en plaats elementen terug
function destroyScan(){
	QRScanner.destroy();
	$( ".scanBGwrapper" ).css( "display", "none" );
	$( ".ui-content.wrapper" ).css( "display", "block" );
	$( ".ui-content.wrapper.toggleBtntime" ).css( "display", "none" );
	flash = false;
}

//Toggle de lamp
function toggleFlash(){
	if( flash == true){
		flash = false;
		QRScanner.disableLight();
	}
	else{
		flash = true
		QRScanner.enableLight();
	}
}