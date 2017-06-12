
/*  Name: Kevin Veldman
Date: 31-May-2017
Info: This is a modified verison of the cordova-plugin-mqtt the github
repository of the original can be found:
https://github.com/arcoirislabs/cordova-plugin-mqtt
*/
var connect = false;
var topicName = "5C:CF:7F:1A:52:8B";
var clothingType;
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    document.getElementById("connect").addEventListener('touchend',function(ev){
      cordova.plugins.CordovaMqTTPlugin.connect({
        url:"tcp://broker.hivemq.com", //a public broker used for testing purposes only. Try using a self hosted broker for production.
        port:"1883",
        clientId:"Maryn",
        username:"Maryn",
        password:"c5be3950f8444efd84ff9c43780928fb",
        success:function(s){
          connect = true;
          console.log(JSON.stringify(s));
          document.getElementById("connect").style.display = "none";
          document.getElementById("disconnect").style.display = "block";
          document.getElementById("activity").innerHTML += "--> Success: you are connected to, "+document.getElementById("url").value+":"+document.getElementById("port").value+"<br>"
        },
        error:function(e){
          connect = false;
          document.getElementById("activity").innerHTML += "--> Error: something is wrong,\n "+JSON.stringify(e)+"<br>";
          document.getElementById("connect").style.display = "block";
          document.getElementById("disconnect").style.display = "none";
          alert("err!! something is wrong. check the console")
          console.log(e);
        },
        onConnectionLost:function (){
          connect = false;
          document.getElementById("activity").innerHTML += "--> You got disconnected<br>";
          document.getElementById("connect").style.display = "block";
          document.getElementById("disconnect").style.display = "none";
        }
      })
    });
    document.getElementById("disconnect").addEventListener('touchend',function(e){
      document.getElementById("connect").style.display = "block";
      document.getElementById("disconnect").style.display = "none";
      cordova.plugins.CordovaMqTTPlugin.disconnect({
        success:function(s){
          connect = false;
          document.getElementById("connect").style.display = "block";
          document.getElementById("disconnect").style.display = "none";
          document.getElementById("activity").innerHTML += "--> Success: you are now disconnected"+"<br>"
        },
        error:function(e){
          document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
          document.getElementById("connect").style.display = "none";
          document.getElementById("disconnect").style.display = "block";
          //alert("err!! something is wrong. check the console")
          console.log(e);
        }
      });
    });
    document.getElementById("subscribe").addEventListener('touchend',function(ev){
      if (!connect) {
        alert("First establish connection then try to subscribe");
      } else {
        cordova.plugins.CordovaMqTTPlugin.subscribe({
          topic:topicName,
          qos:0,
          success:function(s){
            document.getElementById("subscribe").style.display = "none";
            document.getElementById("unsubscribe").style.display = "block";
            document.getElementById("activity").innerHTML += "--> Success: you are subscribed to the topic, "+topicName+"<br>"
            //get your payload here
            //Deprecated method
            document.addEventListener(topicName,function (e) {
              e.preventDefault();
            });

            cordova.plugins.CordovaMqTTPlugin.listen(topicName,function (payload,params,topic,topic_pattern) {
              //Full logic written by: Kevin Veldman

              //Recieved Event code goed here
              //Saving the payload of the message to the latestmsg variable
              var latestmsg = JSON.stringify(payload);
              latestmsg = latestmsg.replace('"','');
              latestmsg = latestmsg.replace('"','');
              latestmsg = latestmsg.split('/');
              var humidity = parseInt(latestmsg[0]);
              getDryPercentage(humidity, clothingType);
              var now             = new Date().getTime(),
              miniTimer = new Date(now + 1*1000);
              if(parseInt(humidity)<100){
                cordova.plugins.notification.local.schedule({
                  text: "Uw kleding is droog1",
                  at: now,
                  led: "FFFF00",
                  icon:'res://icon.png'
                });
              };
              //https://github.com/katzer/cordova-plugin-local-notifications
              //Debug function for making a lastest message block:
              //document.getElementById("latest").innerHTML = latestmsg;

              //Log function that can write to an activity div to say what message was recieved with the topic name.
              //document.getElementById("activity").innerHTML += "--> Payload for"+topic+" topic: "+latestmsg+"<br>"
            })
          },
          error:function(e){
            document.getElementById("activity").innerHTML += "--> Error: something is wrong when subscribing to this topic, "+e+"<br>";
            document.getElementById("subscribe").style.display = "block";
            document.getElementById("unsubscribe").style.display = "none";
            //alert("err!! something is wrong. check the console")
            console.log(e);
          }
        });
      }
    });
    document.getElementById("unsubscribe").addEventListener('touchend',function(ev){
      cordova.plugins.CordovaMqTTPlugin.unsubscribe({
        topic:topicName,
        success:function(s){
          document.removeEventListener(topicName);
          document.getElementById("unsubscribe").style.display = "none";
          document.getElementById("subscribe").style.display = "block";
          document.getElementById("activity").innerHTML += "--> Success: you are unsubscribed to the topic, "+topicName+"<br>"
        },
        error:function(e){
          document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
          document.getElementById("subscribe").style.display = "block";
          document.getElementById("unsubscribe").style.display = "none";
          //alert("err!! something is wrong. check the console")
          console.log(e);
        }
      });
    });
    document.getElementById("publish").addEventListener('touchend',function(ev){
      if (!connect) {
        alert("First establish connection then try to publish")
      } else {
        cordova.plugins.CordovaMqTTPlugin.publish({
          topic:document.getElementById("topic_pub").value,
          payload:document.getElementById("payload").value,
          qos:0,
          retain:false,
          success:function(s){
            document.getElementById("activity").innerHTML += "--> Success: you have published to the topic, "+topicName+"<br>";
          },
          error:function(e){
            document.getElementById("activity").innerHTML += "--> Error: something is wrong, "+e+"<br>";
            //alert("err!! something is wrong. check the console")
            console.log(e);
          }
        });
      }
    });
    console.log('Received Event: ' + id);
  },
  append:function (id,s) {
    // it is just a string append function. Nothing to do with the MQTT functions
    var node = document.createElement("p");                 // Create a <li> node
    var textnode = document.createTextNode(s);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById(id).appendChild(node);     // Append <li> to <ul> with id="myList"
  }
};
function getDryPercentage(humidity, clothingType){
  //Calculation function for clothingType
  //return of the fucntion makes a percentage
  return parseInt(Math.random()*100);
};

app.initialize();
