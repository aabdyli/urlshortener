const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const CounterSchema = new mongoose.Schema({
  seq: { type: Number, default: 0}
});

const UrlSchema = new mongoose.Schema({
  "original_url": {type: "string", required: true}
});

const counter = mongoose.model('counter', CounterSchema);

UrlSchema.pre('save', function(next) {
  const doc = this;
  
  counter.findByIdAndUpdateAsync({_id: 'entityId'}, 
                                 {$inc: {seq: 1}}, 
                                 {new: true, upsert: true}
  .then(function(count){
    doc.short_url = count.seq;
    next()
  })
  .catch(function(error) {
    throw error;
  }))
});