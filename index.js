const express = require('express');
const app = express();
const {getTable} = require ('./createHTML.js');

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  getTable().then(
    function(value) {console.log(value);res.send(value);}
  );

})

app.listen(3000);