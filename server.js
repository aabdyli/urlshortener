'use strict';

const express = require('express');
const dns = require('dns')
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();


const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);

const Schema = mongoose.Schema

const UrlSchema = new mongoose.Schema({
  original_url: {type: "string", required: true},
  short_url: {type: "string"}
});

const UrlData = mongoose.model('Url', UrlSchema);

// Basic Configuration 
const port = process.env.PORT || 3000;


/** this project needs a db !! **/ 


var timeout = 10000;

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
    dns.lookup(url.replace(/(^\w+:|^)\/\//, ''), function (err) {
      if(err) {
        res.json({"error": "invalid URL"})
      } else {
        next()
      }
    })
  } else {
    res.json({"error": "invalid URL"})
  }
}, function (req, res) {
  UrlData.findOne({ original_url: req.body.url})
    .exec(function (err, data) {
      console.log(data);
      if(err) {
        const short_url = Math.random().toString(36).substring(7);
        
        const uri = new UrlData({
          original_url: req.body.url, 
          short_url: short_url
        })
        
        uri.save()
          .then(uri => {
            console.log(uri);
          })
          .catch(err => {
            console.log(err);
          });
        
        res.json("nth");
      } else {
        res.json("smth")
      }
    });
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});