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
      console.log(r);
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
     console.log(options.roomName);
     api[num] = new JitsiMeetExternalAPI(domain, options);    
     api[num].executeCommand("subject", roomnames[num]);  

     api[num].on('readyToClose', () => {
       console.log(num);
       chatClosed(api,num);
     });

     api[num].on('videoConferenceJoined', (arg) => {
       numusers = api[num].getParticipantsInfo().length;
       var rurl=roomurl+'?'+num+'='+numusers;
       console.log(rurl);
       update_numbers(rurl);
     });
}

function chatClosed(api,num) {
  //console.log(api[num]);
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
   console.log('called update_numbers('+url+')');
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() { 
     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
       var json_resp = xmlHttp.response;
       for (const room in json_resp) {
         console.log(room);
         document.getElementById(room).innerHTML=json_resp[room];
       }
       //alert(json.Wohnzimmer);
     }
   }
   xmlHttp.responseType = 'json';
   xmlHttp.open("GET", url, true);
   xmlHttp.send(null); 
}

function update_page_info() {
  if (!videoActive) {
    update_numbers(roomurl);
  };
  // alle 30 Sekunden Seite aktualisieren
  window.setTimeout("update_page_info()", 30000);
}
