var express = require('express');
var router = express.Router();
var models = require('../models');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var sha256 = require('sha256');
var multer = require('multer');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var moment = require('moment');
var async = require('async');

var _storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, config.db.upload_path)
	},
	filename: function (req, file, cb) {

		cb(null, file.originalname);
	}
})
var upload = multer({ storage: _storage})

// List
router.get('/',function(req,res) {
	models.Slide.findAll({
		order : 'seq ASC'
	}).then(function(slideSvArr) {
		var slideCliArr = [];
		slideSvArr.forEach(function(slideSv) {
			var slideCli = {};
			slideCli.id = slideSv.id;
			slideCli.title = slideSv.title;
			slideCli.path = slideSv.path;
			slideCli.seq = slideSv.seq;
			slideCli.link = slideSv.link;
            slideCli.show = slideSv.show;
			slideCli.createdAt = moment(slideSv.createdAt).format("YYYY-MM-DD");
			slideCli.updatedAt = moment(slideSv.updatedAt).format("YYYY-MM-DD");
			slideCliArr.push(slideCli);
		});
		res.contentType('application/json');
		res.send(slideCliArr);
	});
});

// Create
router.post('/', upload.single('file'), loadUser, function(req, res, file) {
	var result = {};
	models.Slide.create(req.body).then(function(slide) {
        async.each([req.file], function(file, callback) {
            if (file) {
                if (file.isFileSizeLimit) {
                    callback("파일 사이즈가 초과하였습니다. ( 최대 20MB )");
                } else {
                    var file_name = Date.now() + "-" + file.originalname;
                    var file_path = path.join(config.db.upload_path, 'slide', file_name);
                    mkdirp(path.join(config.db.upload_path, 'slide'), function(err) {
                        if (!err) {
                            fs.rename(file.path, file_path, function(err) {
                                if (!err) {
                                    req.body.path = file_path;
                                      slide.updateAttributes(req.body).then(function() {
                                      	callback();
            							 
       								});
                                } else callback(err);
                            });
                        } else callback(err);
                    });
                }
            } else callback();
        }, function(err) {
            if (!err) {
                res.send({
                    error : false,
                    id: slide.id
                });
            } else {
                slide.destroy().then(function() {
                    if (req.file) fs.unlinkSync(req.file.path);
                    res.send({
                        error : true,
                        text: err
                    });
                });
            }
        });
    });
});

// Read
router.get('/:id', function(req,res) {
	models.Slide.findOne({
		where : {
			id: req.params.id
		}
	}).then(function(slide) {
		if(slide!==null) {
			var slideCli={};
			slideCli.id = slide.id;
			slideCli.title = slide.title;
			slideCli.path = slide.path;
			slideCli.seq = slide.seq;
			slideCli.link = slide.link;
            slideCli.show = slide.show;
			slideCli.createdAt = slide.createdAt;
			slideCli.updatedAt = slide.updatedAt;

			res.contentType('application/json');
			res.send(slideCli);
		} else {
			res.send({
				error: true
			});
		}
	});
});

//Update
router.put('/:id', loadUser, function(req, res) {
	models.Slide.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(slide) {
        if (slide !== null) {               
            slide.updateAttributes(req.body).then(function() {
                res.send({
                    error: false,
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});
 
// Delete
router.delete('/:id', loadUser, function(req, res) {
	models.Slide.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(slide) {
        if (slide !== null) {
            slide.destroy().then(function() {
                res.send({
                    error: false,
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});

function loadUser(req,res,next) {
    if(req.session.user){
        if(req.session.user.type == 0){ //관리자
            next();
        }else{ //일반 사용자
            res.redirect('"/main#/"');
        }
    }
    else {
        res.redirect('"/main#/"');
    }
}

module.exports = router;
