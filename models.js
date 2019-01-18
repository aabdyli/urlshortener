const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)

const UrlSchema = new mongoose.Schema({
  "original_url": {type: "string", required: true}
})