'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const dns = require('dns')
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

const Schema = mongoose.Schema

const URLSchema = new Schema({
  url: { type: String, required: true}
})

const URLdata = mongoose.model('URL', URLSchema)

function createAndSaveURL(done) {
  const urlData = new URLdata();
  urlData.save((err,data) => {
    if (err) console.log(err)
      done(null , data);
  })
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.post('/api/shorturl/new', function (req, res, next) {
  const url = req.body.url
  const urlRegex = /(https:\/\/www\.|https:\/\/|http:\/\/www\.|http:\/\/)([a-z0-9]{1,20}\.)?([a-z0-9-]{2,64}\.[a-z0-9]{2,25})(\/.*)?/
  if(urlRegex.test(url)) {
    next()
  } else {
    res.json({"error": "invalid URL"})
  }
}, function (req, res) {
  createAndSaveURL((err,data) => {
    if(err) { return err; }
    if(!data) {
      console.log('Missing `done()` argument');
      return {message: 'Missing callback argument'};
    }
    URL.findById(data['_id'], (err, uri) => {
      if(err) {return err;}
      res.json(uri);
      uri.remove();
    })
  })
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});