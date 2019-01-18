const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);

const CounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0}
});

const UrlSchema = new mongoose.Schema({
  original_url: {type: "string", required: true},
  short_url: {type: Number, default: 0}
});

const counter = mongoose.model('counter', CounterSchema);

UrlSchema.pre('save', function(next) {
  const doc = this;
  
  if(doc.isNew) {
    counter.findByIdAndUpdate({_id: 'entityId'}, 
                              {$inc: {seq: 1}}, 
                              {new: true, upsert: true}
    .then(function(count){
      doc.short_url = count.seq;
      next()
    })
    .catch(function(error) {
      next(error);
    }))
  } else {
    next()
  }
});

const UrlData = mongoose.model('url', UrlSchema);

exports.UrlData = UrlData;