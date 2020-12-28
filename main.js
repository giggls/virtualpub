var api=[];
var roomnames=['Schlafzimmer','Kueche','Garage','Terrasse','kidz','foo','bar','baz','bat', '2021'];
var numusers=0;
var roomurl = 'https://geggus.net/roomcount';
var videoActive = -1;

var expiration_date="Jan 1, 2021 00:00:00";

// run this on page load
window.addEventListener('load', function () {
  var elems;
  for (var r = 0; r < roomnames.length; r++) {
    elems = document.getElementsByClassName(roomnames[r]);
    for (var i = 0; i < elems.length; i++) {
      elems[i].addEventListener("click", on.bind(null, r), false);
      elems[i].style.cursor="pointer";
    }
  }
  update_page_info();
})

// discard active video chat and open chat 9 if it is not already active
function offon2021() {
  if (videoActive != 9) {
    if (videoActive >= 0) {
      api[videoActive].executeCommand('hangup');
    }
    on(9);
  }
}

function on(num) {
     videoActive = num;
     document.getElementById("mainframe").style.display = "none"
     document.getElementById("videoframe").style.display = "block"
     options.roomName = 'SilvesterParty_2020_'+roomnames[num];
     api[num] = new JitsiMeetExternalAPI(domain, options);    
     api[num].executeCommand("subject", roomnames[num]);  

     api[num].on('readyToClose', () => {
       chatClosed(api,num);
     });

     api[num].on('videoConferenceJoined', (arg) => {
       numusers = api[num].getParticipantsInfo().length;
       var rurl=roomurl+'?'+num+'='+numusers;
       update_numbers(rurl);
     });
}

function chatClosed(api,num) {
  api[num].dispose();
  var rurl=roomurl+'?'+num+'=-1';
  update_numbers(rurl);
  document.getElementById("mainframe").style.display = "block";
  document.getElementById("videoframe").style.display = "none";
  videoActive = -1;
  sec_interval();  
}

var domain = "meet.gnuher.de";
var options = {
    roomName: "",
    parentNode: document.querySelector("#videoframe"),
    configOverwrite: {},
    interfaceConfigOverwrite: {}
}

// update number of persons in Room displayed on landingpage
function update_numbers(url) {
   // console.log('called update_numbers('+url+')');   
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() { 
     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
       var json_resp = xmlHttp.response;
       for (const room in json_resp) {
         var obj = document.getElementsByClassName(roomnames[room]+"_guests");
         // console.log(obj[0]);
         if (obj[0] != undefined) {
           var txt = obj[0].innerHTML;
           // initial replacement
           txt = txt.replace("xx", json_resp[room]);
           // this replacement is for old numbers
           txt = txt.replace(/[0-9]+/, json_resp[room]);
           obj[0].innerHTML=txt;
         }
       }
     }
   }
   xmlHttp.responseType = 'json';
   xmlHttp.open("GET", url, true);
   xmlHttp.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
   xmlHttp.send(null); 
}

function update_page_info() {
  if (videoActive < 0) {
    update_numbers(roomurl);
  };
  // alle 30 Sekunden Seite aktualisieren
  window.setTimeout("update_page_info()", 30000);
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

// Countdown timer
// Set the date we're counting down to
var countDownDate = new Date(expiration_date).getTime();

// Update the count down every second
var interval = setInterval(function(){ sec_interval(); }, 1000);

function sec_interval() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  
  // 5 minutes before timer expires
  if ((distance / 1000 / 60) < 5 ) {
    document.getElementById("noon").style.display = "block";
  }
    
  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance / (1000 * 60 * 60 )));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("countdown").innerHTML = zeroPad(hours,2) +":"+ zeroPad(minutes,2) + ":" + zeroPad(seconds,2);
    
  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(interval);
    document.getElementById("countdown").innerHTML = "00:00:00";
  }
}

document.addEventListener('keydown', keyEvent);

function keyEvent(e) {
  // view noon frame after pressing insert
  if (e.code == "Insert") {
    document.getElementById("noon").style.display = "block";
  }
  if (e.code == "Delete") {
    document.getElementById("noon").style.display = "none";
  }
}
