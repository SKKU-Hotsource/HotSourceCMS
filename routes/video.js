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
//var mysql = require('mysql');
//var pool = mysql.createPool(config.db);
//storage destination
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, config.db.upload_path)
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage }, {limits: 1024 * 1024 * 1024 })

models.Attachment.belongsTo(models.Post);

// List
router.get('/list/?*', function(req, res) {
    models.Post.findAll({
        order : 'id DESC',
        where: { categoryId: req.query.categoryId },
        include: {
            model: models.Attachment,
            attributes: ['file_name', 'path'],
            order: [['createdAt', 'DESC']]
        }
    }).then(function(videoSvArr) {
        var videoCliArr = [];
        videoSvArr.forEach(function(videoSv) {
            var videoCli = {
                id: videoSv.id,
                title: videoSv.title,
                author: videoSv.author,
                cnt: videoSv.cnt,
                time: moment(videoSv.updatedAt).format("YYYY-MM-DD"),
            };

            if(videoSv.Attachments[0]){
                videoCli.file_name = videoSv.Attachments[0].dataValues.file_name;
                videoCli.path = videoSv.Attachments[0].dataValues.path;
            }
            videoCliArr.push(videoCli);
        });

        var resData = {
            videoList : videoCliArr
        }
        res.contentType('application/json');
        res.send(resData);
    });
});


 
// Create
router.post('/', upload.single('file'), loadUser, function(req, res,file) {
    var result = {};
    req.body.UserId = req.session.user.id;
    req.body.author = req.session.user.user_name;
    models.Post.create(req.body).then(function(videoPost) {
        async.each([req.file], function(file, callback) {
            if (file) {
                if (file.isFileSizeLimit) {
                    callback("파일 사이즈가 초과하였습니다. ( 최대 1GB )");
                } else {
                    var file_name = Date.now() + "-" + file.originalname;
                    var file_path = path.join(config.db.upload_path, 'video', file_name);
                    req.file.filename = file_name;
                    
                    mkdirp(path.join(config.db.upload_path, 'video'), function(err) {
                        if (!err) {
                            fs.rename(file.path, file_path, function(err) {
                                if (!err) {
                                    req.body.PostId = videoPost.id
                                    req.body.file_name = file.originalname;
                                    req.body.path = file_path;
                                    req.body.type = file.mimetype;
                                    req.body.size = file.size;
                                    models.Attachment.create(req.body).then(function(videofile) {
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
                    id: videoPost.id
                });
            } else {
                videoPost.destroy().then(function() {
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
 

router.get('/post/:CategoryId/:id', function(req, res) {
    models.Post.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(videoPost) {
        if (videoPost !== null) {
            async.parallel({
                files: function(callback) {
                    models.sequelize.query(
                        'select file_name,path,type,size,downs,id from attachment where PostId=' + videoPost.id + ' order by id limit 0,2'
                    ).then(function(files) {
                        files=files[0];
                        if (files !== null) {
                            ///*files.forEach(function(file) {
                            //    file.link = '/file/' + path.basename(file.path);
                            //    delete file.path;
                            //});*/
                            callback(null, files);
                        } else callback(null, null);
                    });
                }
            },
            function(err, results) {
                models.sequelize.query('update post set cnt=cnt+1 where id=' + videoPost.id).then(function() {
                    videoPost.dataValues.time = moment(videoPost.updatedAt).format("YYYY-MM-DD");
                    videoPost.dataValues.files = results.files;
                    videoPost.cnt++;
                    videoPost.dataValues.error = false;
                    res.send(videoPost);
                });
            });
        }
        else {
            res.send({
                error: true
            });
        }
    });
});
 
// Update
router.put('/:CategoryId/:id', upload.single('file'), loadUser, function(req, res,file) {
    models.Post.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(videoPost){
        videoPost.updateAttributes(req.body);
        async.each([req.file], function(file, callback) {
            if (file) {
                var file_name = Date.now() + "-" + file.originalname;
                var file_path = path.join(config.db.upload_path, 'video', file_name);
                if (file.isFileSizeLimit) {
                    callback("파일 사이즈가 초과하였습니다. ( 최대 1GB )");
                } else {
                    mkdirp(path.join(config.db.upload_path, 'video'), function(err) {
                        if (!err) {
                            fs.rename(file.path, file_path, function(err) {
                                if (!err) {
                                    req.body.VideoPostId = videoPost.id
                                    req.body.file_name = file.originalname;
                                    req.body.path = file_path;
                                    req.body.type = file.mimetype;
                                    req.body.size = file.size;
                                    models.Attachment.findOne({
                                        where: {
                                            id: req.body.id
                                        }
                                    }).then(function(videoFile){
                                        if(videoFile !==null)
                                            {videoFile.updateAttributes(req.body);}
                                        else{
                                            models.Attachment.create(req.body).then(function(videofile) {
                                            callback(); 
                                            });
                                        }
                                    });
                                } else callback(err);
                            });

                        } else callback(err);
                    });
                }
            } else callback();
        });
    });
});

// Delete
router.delete('/:id', loadUser, function(req, res, next) {
    models.Post.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(videoPost) {
        if (videoPost !== null) {
            videoPost.destroy().then(function() {
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


// File
router.get('/file/:VideoPostId/:file_name', function(req, res, next) {
    models.Attachment.findOne({
        where: {
            path: path.join(config.db.upload_path, req.params.VideoPostId, req.params.file_name)
        }
    }).then(function(videoFile) {
        if (videoFile !== null) {
            videoFile.downs++;
            videoFile.save().then(function(videofile) {
                res.download(videofile.path, videofile.name);
            });
        } else next();
    });
});

router.delete('/file/:VideoPostId/:file_name', loadUser, function(req, res) {
    models.Attachment.findOne({
        where: {
            VideoPostId: req.params.id
        }
    }).then(function(videoFile) {
        if (videoFile !== null) {
            fs.unlinkSync(videoFile.path);
            videoFile.destroy().then(function() {
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
