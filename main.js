var api=[];
var roomnames=['Wohnzimmer','Kueche','Balkon','Klo','2021'];
var numusers=0;
var roomurl = 'https://geggus.net/roomcount';

// run room number update function on page load
window.addEventListener('load', function () {
  update_numbers(roomurl);
})

function on(num) {
     document.getElementById("mainframe").style.display = "none"
     document.getElementById("videoframe").style.display = "block"
     options.roomName = 'SilvesterParty_2020_'+roomnames[num];    
     api[num] = new JitsiMeetExternalAPI(domain, options);    
     api[num].executeCommand("subject", roomnames[num]);  
     api[num].on('readyToClose', () => {    
       chatClosed(api[num],num);
     });
     api[num].on('videoConferenceJoined', (arg) => {
       numusers = api[num].getParticipantsInfo().length;
       var rurl=roomurl+'?'+roomnames[num]+'='+numusers;
       update_numbers(rurl);
     });
}

function chatClosed(api,num) {
  api.dispose();
  var rurl=roomurl+'?'+roomnames[num]+'=-1';
  update_numbers(rurl);
  document.getElementById("mainframe").style.display = "block";
  document.getElementById("videoframe").style.display = "none";
}

var domain = "meet.gnuher.de";
var options = {
    roomName: "",
    parentNode: videoframe,
    configOverwrite: {},
    interfaceConfigOverwrite: {}
}

// update number of persons in Room displayed on landingpage
function update_numbers(url) { 
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() { 
     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
       var json_resp = xmlHttp.response;
       for (const room in json_resp) {
         document.getElementById(room).innerHTML=json_resp[room];
       }
       //alert(json.Wohnzimmer);
     }
   }
   xmlHttp.responseType = 'json';
   xmlHttp.open("GET", url, true);
   xmlHttp.send(null); 
}
