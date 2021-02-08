/*

Simple Jitsi Meet based virtual pub

(c) 2021 Sven Geggus <sven-git@geggus.net>

*/

var api=[];
var numusers=0;
var videoActive = -1;

// SVG image DOM initialized on load
var svgobj;

var options = {
    roomName: "",
    parentNode: document.querySelector("#videoframe"),
    configOverwrite: {},
    interfaceConfigOverwrite: {
       HIDE_INVITE_MORE_HEADER: true
     }
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

// run this on page load
window.addEventListener('load', function () {
  svgobj = document.getElementById("virtualpub").contentDocument;
  console.log(svgobj);
  var elem;
  for (var r = 0; r < roomhosts.length; r++) {
    var name = 'link_' + zeroPad(r+1,2);
    elem = svgobj.getElementById(name);
    elem.addEventListener("click", on.bind(null, r), false);
    elem.style.cursor="pointer"; 
  }
  update_page_info();
})

function on(num) {
     var name = 'link_' + zeroPad(num+1,2);
     
     videoActive = num;
     document.getElementById("mainframe").style.display = "none"
     document.getElementById("videoframe").style.display = "block"
     options.roomName = roomname_prefix+'_'+svgobj.getElementById(name).textContent;
     console.log(options.roomName);
     
     api[num] = new JitsiMeetExternalAPI(jitsi_hosts[roomhosts[num]], options);    
     api[num].executeCommand("subject", options.roomName);

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
}

// update number of persons in room displayed on landingpage
function update_numbers(url) {
   // console.log('called update_numbers('+url+')');   
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() { 
     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
       var json_resp = xmlHttp.response;
       for (const room in json_resp) {
         //console.log(room);
         var name = zeroPad(parseFloat(room)+1,2)+'_guests';
         //console.log(name);
         var obj = svgobj.getElementById(name);
         if (obj != undefined) {
           var txt = obj.innerHTML;
           //console.log(txt);
           txt = txt.replace(/>[0-9]+</, '>'+json_resp[room]+'<');
           txt = txt.replace(/>[0-9]+ /, '>'+json_resp[room]+' ');
           console.log(json_resp[room]);
           obj.innerHTML=txt;
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
  var rurl = roomurl;
  if (!(videoActive < 0)) {
     numusers = api[videoActive].getParticipantsInfo().length;
     rurl=roomurl+'?'+videoActive+'='+numusers;
  }
  // console.log("update_numbers: "+rurl);
  update_numbers(rurl);
  // alle 30 Sekunden Seite aktualisieren
  window.setTimeout("update_page_info()", 30000);
}

