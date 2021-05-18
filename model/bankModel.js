const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
    ifsc : String,
    bank_id : Number,
    branch : String,
    address : String,
    city : String,
    district : String,
    state : String
})

module.exports = mongoose.model('bank',bankSchema);


