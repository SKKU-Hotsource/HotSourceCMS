var express = require('express');
var router = express.Router();
var models = require('../models');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
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
var upload = multer({ storage: _storage }, {limits: 1024 * 1024 * 20});

// List
router.get('/', function(req, res) {
	models.MainAdmin.findOne({
        order : 'id ASC'
    }).then(function(mainAdminSv) {
        var mainAdminCli = {};
        if(mainAdminSv == null) {
            models.MainAdmin.create().then(function(){
                mainAdminCli.mainLogo = null;
                mainAdminCli.title = null;
                mainAdminCli.useSlide = 0;
                mainAdminCli.leftBoard = null;
                mainAdminCli.rightBoard = null;
            });
        }
        else {
            mainAdminCli.mainLogo = mainAdminSv.mainLogo;
            mainAdminCli.title = mainAdminSv.title;
            mainAdminCli.useSlide = mainAdminSv.useSlide;
            mainAdminCli.leftBoard = mainAdminSv.leftBoard;
            mainAdminCli.rightBoard = mainAdminSv.rightBoard;
        }   
        res.contentType('application/json');
        res.send(mainAdminCli);
    });
});

// Update
router.put('/', upload.single('file'), loadUser, function(req, res, file) {
    if(req.file) {
        var file_name = Date.now() + "-" + req.file.originalname;
        var file_path = path.join(config.db.upload_path,'logo',file_name);
        req.body.mainLogo = file_path;
    }
    models.MainAdmin.findOne({
        order : 'id ASC'
    }).then(function(mainAdmin) {
        if (mainAdmin !== null) {
            mainAdmin.updateAttributes(req.body).then(function() {
                async.each([req.file], function(file, callback) {
                    if(file) {
                        if (file.isFileSizeLimit) {
                            callback("파일 사이즈가 초과하였습니다. ( 최대 20MB )");
                        } else {
                            mkdirp(path.join(config.db.upload_path,'logo'), function(err) {
                                if (!err) {
                                    fs.rename(file.path, file_path, function(err) {
                                        if (!err) {
                                            res.send({
                                                mainLogo: file_path
                                            });
                                        } else callback(err);
                                    });
                                } else callback(err);
                            });
                        }
                    } else callback();
                }, function(err) {
                    if(!err) {
                        res.send({
                            error: false
                        });
                    } else {
                        if (req.file) 
                            fs.unlinkSync(req.file.path);
                        res.send({
                            error: true
                        });
                    }
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
