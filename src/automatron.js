let functions = require('./functions.js');
const fs = require('fs');

// Date
let today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
today = monthNames[mm] + ' ' + dd + ', ' + yyyy;
let fecha = dd+'-'+mm+'-'+yyyy;
let synconfig;



exports.execute = function(nameSource){
  synconfig = functions.readConfig(nameSource);

  let req; 
  req = {
    body : {
      name: synconfig.Title,
      desc: synconfig.Description,
      url: synconfig.URL,
      refresh: synconfig.Refresh,
      sel: synconfig.Selector
    }
  }
  console.log(`Son las ${time} del ${fecha}`);
  // console.log(config);
  if (req.body.selector == 'RSS') {
    functions.addRSS(req);
  } else {
    functions.addURL(req);
  }
  // console.log(readConfig(sourceName));
}