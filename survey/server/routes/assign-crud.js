var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var multer = require('multer');


var Container = require('../models/Container.js');
var Parts = require('../models/Parts.js');

var ContainerParts = require('../models/Container_Parts.js');

router.use(bodyParser.urlencoded({ extended: true }));

//multer
const storage = multer.diskStorage({
  destination: './public/images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });


router.get('/getContainer', function (req, res, next) {
  Container.find({}, function (err, docs) {
    res.json(docs)
  })
})

router.get('/getparts', function (req, res) {
  Parts.find({}, function (err, docs) {
    res.json(docs);

  });
});

router.post('/create_defect', async (req, res) => {


  //check container id already exist
  let checkAlreadyExist = await ContainerParts.find({ 'container_id': req.body.container_id });
  if (checkAlreadyExist) {
    res.send({ "status": false, "message": "Container Already Exist" });
  }
  else {
    var newContainerDefect = new ContainerParts();
    newContainerDefect.container_id = req.body.container_id;
    newContainerDefect.parts = req.body.parts

    newContainerDefect.save(function (err) {
      console.log('err', err);
      if (!err) {
        res.send({ "status": true, "message": "success" });
      }
      else {
        res.send({ "status": false, "message": "fail" });

      }
    });
  }
});


router.get('/view_defect/:containerId', async (req, res) => {

  try {

    let id = req.params.containerId;

    let data = await Container.aggregate([
      {
        $match: {
          "_id": mongoose.Types.ObjectId(id)
        }
      }, {
        $lookup: {
          from: 'Container_part',
          localField: '_id',
          foreignField: 'container_id',
          as: 'containerparts'
        }
      },
      {
        '$unwind': {
          path: '$containerparts',
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    if (data.length) {
      for (let defect of data[0].containerparts.parts) {

        let defectParts = await Parts.findById(defect.partId);
        defect['name'] = defectParts.part_name;

        defect.image = defect.image.map(v => {
          v = process.env.ImageUrl + v
          console.log('v', v);
          return v
        })
      }

      res.send({ "status": true, "message": "success", 'data': data[0] });
    }
    else {

      res.send({ "status": true, "message": "success", 'data': data[0] });
    }


  } catch (e) {
    console.log('eerr', e);
    res.send({ "status": false, "message": "fail" });
  }
})

//file upload
router.post('/img_upload', upload.single('file'), (req, res) => {
  try {
    return res.status(201).json({
      message: 'File uploded successfully', "status": true, 'filename': req.file.filename
    });
  } catch (error) {
    console.error(error);
  }

})



// router.post('/asgn', function (req, res) {

//   var newwork = new Work();
//   newwork.work = req.body.Work;
//   newwork.playing = req.body.playing;
//   newwork.tunnel_in = req.body.tunnel_in;

//   newwork.save(function (err) {
//     if (!err) {
//       res.send({ "status": true, "message": "success" });
//     }
//     else {
//       res.send({ "status": false, "message": "fail" });

//     }
//   });
// });








// router.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
// });


module.exports = router;
