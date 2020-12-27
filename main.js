var api=[];
var roomnames=['Schlafzimmer','Kueche','Garage','Terrasse','kidz','foo','bar','baz','2021'];
var numusers=0;
var roomurl = 'https://geggus.net/roomcount';
var videoActive = false;

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

function on(num) {
     videoActive = true;
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
  //var iframe = api[num].getIFrame();
  //iframe.parentNode.removeChild(iframe);
  api[num].dispose();
  var rurl=roomurl+'?'+num+'=-1';
  update_numbers(rurl);
  document.getElementById("mainframe").style.display = "block";
  document.getElementById("videoframe").style.display = "none";
  videoActive = false;
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
  if (!videoActive) {
    update_numbers(roomurl);
  };
  // alle 30 Sekunden Seite aktualisieren
  window.setTimeout("update_page_info()", 30000);
}
