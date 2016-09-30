var express = require('express');
var router = express.Router();
var models = require('../models');
var session = require('express-session');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var multer = require('multer');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var moment = require('moment');
var async = require('async');

//storage destination
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, config.db.upload_path);
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage }, {limits: 1024 * 1024 * 20})

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
    }).then(function(boardSvArr) {
        var boardCliArr = [];

        boardSvArr.forEach(function(boardSv) {
            var boardCli = {
                id: boardSv.id,
                title: boardSv.title,
                author: boardSv.author,
                cnt: boardSv.cnt,
                categoryId: boardSv.CategoryId,
                time: moment(boardSv.updatedAt).format("YYYY-MM-DD")
            };
            if(boardSv.Attachments[0]){
                boardCli.file_name = boardSv.Attachments[0].dataValues.file_name;
                boardCli.path = boardSv.Attachments[0].dataValues.path;
            }
            boardCliArr.push(boardCli);
        });

        res.contentType('application/json');
        res.send(boardCliArr);
    });
});




// Create
router.post('/', upload.single('file'), loadUser, function(req, res,file) {
    var result = {};
    req.body.UserId = req.session.user.id;
    req.body.author = req.session.user.user_name;
    models.Post.create(req.body).then(function(boardPost) {
        async.each([req.file], function(file, callback) {
            if (file) {
                if (file.isFileSizeLimit) {
                    callback("파일 사이즈가 초과하였습니다. ( 최대 20MB )");
                } else {
                    var file_name = Date.now() + "-" + file.originalname;
                    var file_path = path.join(config.db.upload_path, 'attachment', file_name);
                    req.file.filename = file_name;

                    mkdirp(path.join(config.db.upload_path, 'attachment'), function(err) {
                        if (!err) {
                            fs.rename(file.path, file_path, function(err) {
                                if (!err) {
                                    req.body.PostId = boardPost.id
                                    req.body.file_name = file.originalname;
                                    req.body.path = file_path;
                                    req.body.type = file.mimetype;
                                    req.body.size = file.size;
                                    models.Attachment.create(req.body).then(function(boardfile) {
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
                    id: boardPost.id
                });
            } else {
                boardPost.destroy().then(function() {
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
            id: req.params.id,
        }
    }).then(function(boardPost) {
        if (boardPost !== null) {
            async.parallel({
                files: function(callback) {
                    models.sequelize.query(
                        'select file_name,path,type,size,downs,id from attachment where PostId=' + boardPost.id + ' order by id limit 0,2'
                    ).then(function(files) {
                        files=files[0];
                        if (files !== null) {
                            /*files.forEach(function(file) {
                                file.link = '/file/' + path.basename(file.path);
                                delete file.path;
                            });*/
                            callback(null, files);
                        } else callback(null, null);
                    });
                }
            },
            function(err, results) {
                models.sequelize.query('update post set cnt=cnt+1 where id=' + boardPost.id).then(function() {
                    boardPost.dataValues.time = moment(boardPost.updatedAt).format("YYYY-MM-DD");
                    boardPost.dataValues.files = results.files;
                    boardPost.cnt++;
                    boardPost.dataValues.error = false;
                    res.send(boardPost);
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
    }).then(function(boardPost){
        Post.updateAttributes(req.body);
        async.each([req.file], function(file, callback) {
            if (file) {
                var file_name = Date.now() + "-" + file.originalname;
                var file_path = path.join(config.db.upload_path, 'attachment', file_name);
                if (file.isFileSizeLimit) {
                    callback("파일 사이즈가 초과하였습니다. ( 최대 1GB )");
                } else {
                    mkdirp(path.join(config.db.upload_path, 'attachment'), function(err) {
                        if (!err) {
                            fs.rename(file.path, file_path, function(err) {
                                if (!err) {
                                    req.body.BoardPostId = boardPost.id
                                    req.body.file_name = file.originalname;
                                    req.body.path = file_path;
                                    req.body.type = file.mimetype;
                                    req.body.size = file.size;
                                    models.Attachment.findOne({
                                        where: {
                                            id: req.body.id                                            
                                        }
                                    }).then(function(boardFile){
                                        if(boardFile !==null) {
                                            boardFile.updateAttributes(req.body);
                                            callback(); 
                                        }
                                        else{
                                            models.Attachment.create(req.body).then(function(boardFile) {
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
        }, function(err) {
            if (!err) {
                res.send({
                    error : false,
                });
            } else {
                boardPost.destroy().then(function() {
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

// Delete
router.delete('/:id', loadUser, function(req, res, next) {
    models.Post.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(boardPost) {
        if (boardPost !== null) {
            boardPost.destroy().then(function() {
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

router.get('/file/:BoardPostId/:file_name', function(req, res, next) {
    models.Attachment.findOne({
        where: {
            path: path.join(config.db.upload_path, req.params.BoardPostId, req.params.file_name)
        }
    }).then(function(boardFile) {
        if (boardFile !== null) {
            boardFile.downs++;
            boardFile.save().then(function(boardfile) {
                res.download(boardfile.path, boardfile.name);
            });
        } else next();
    });
});

router.delete('/file/:BoardPostId/:file_name', loadUser, function(req, res) {
    models.Attachment.findOne({
        where: {
            BoardPostId: req.params.id
        }
    }).then(function(boardFile) {
        if (boardFile !== null) {
            fs.unlinkSync(boardFile.path);
            boardFile.destroy().then(function() {
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

//Info List : info is existed
router.get('/info/list', function(req, res) {
    models.Post.findAll({
    }).then(function(boardPost) {
        if (boardPost !== null) {
            async.parallel({
                Infos: function(callback) {
                    models.sequelize.query(
                        'select * from category where category.type = 1'
                    ).then(function(info) {
                        Infos=info[0];
                        for(var i = 0; i< Infos.length; i++){
                            Infos[i].updatedAt =  moment(Infos[i].updatedAt).format("YYYY-MM-DD<HH:MM>");
                        }
                        if (Infos !== null) {
                            callback(null, Infos);
                        } else callback(null, null);
                    });
                }
            },
            function(err, results) {
                res.send(results.Infos);
            });
        }
        else {
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
