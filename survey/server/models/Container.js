var mongoose = require('mongoose');

var workSchema = mongoose.Schema({

  container_name: {
    type: String
  },
  container_description: {
    type: String
  }

});

module.exports = mongoose.model('Container', workSchema, 'Container');