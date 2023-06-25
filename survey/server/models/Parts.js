var mongoose = require('mongoose');

var workSchema = mongoose.Schema({

  part_name: {
    type: String
  },


});

module.exports = mongoose.model('Parts', workSchema, 'Parts');