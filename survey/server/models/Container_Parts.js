var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// ObjectId = Schema.ObjectId;
var workSchema = mongoose.Schema({

  container_id: {
    type: Schema.Types.ObjectId
  },

  parts: [{
    partId: {
      type: Schema.Types.ObjectId,
      ref: 'Parts'
    },
    // productName: {
    //   type: String
    // },
    // location: {
    //   type: String
    // },
    // serialNo: {
    //   type: String
    // },
    // quantity: {
    //   type: Number
    // },
    image: {
      type: Array
    }
  }],
  // part_image: {
  //   type: Array
  // },
  // part_description: {
  //   type: String
  // },

});

module.exports = mongoose.model('Container_part', workSchema, 'Container_part');