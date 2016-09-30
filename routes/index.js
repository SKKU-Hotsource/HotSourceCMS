var express = require('express');
var router = express.Router();
var models = require('../models');
var session = require('express-session');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var sha256 = require('sha256');
var session = require('express-session');
var nodemailer = require('nodemailer');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/main');
});

//세션의 user type을 검사해서 주소 접근 취약점 막기 위한 middle ware
//admin관련 접근에 전부 loaduser 추가함.
function loadUser(req,res,next) {
  if( req.session.user ){
    if(req.session.user.type == 0){ //관리자
        next();
    }else{ //일반 사용자
        res.redirect('/main');
    }
  }
  else
    res.redirect('/main');
}

router.get('/categoryCheck', function(req,res,next) {
    models.Category.findOne({
        where: {
            id: req.query.category_array
        }
    }).then(function(category) {
        var typeCheck;
        switch(category.type) {
            case 0: typeCheck="root"; break;
            case 1: typeCheck="info"; break;
            case 2: typeCheck="board"; break;
            case 3: typeCheck="video"; break;
            case 4: typeCheck="paper"; break;
        }
        if(typeCheck==req.query.path_array){
            result : true
        }else{
            res.send({
                result : false
            });
        }
    })
});


// 로그인
router.post('/login', function(req, res, next) {
    models.User.findOne({ // 유저 검색
        where: {
          	user_id: req.body.uid,
            password: sha256(req.body.password)
        }
    }).then(function(user) {
        if (user !== null) {
            req.session.user = user.dataValues; // 세션 추가 등록
            req.session.user.time = new Date();
            req.session.user.ip = req.connection.remoteAddress;
            delete req.session.user.password;
            res.send(req.session.user);
        } else {
            res.send({
                result: false 
            });
        }
    });
});

// 로그아웃
router.get('/logout', function(req, res, next) {
    req.session.user = {};
    delete req.session.user;
    res.send({
        error: false 
    });
});

router.get('/getSession', function(req, res, next) {
    res.send(req.session.user);
});

//찾기
router.post('/finding', function(req, res, next) {
    models.User.findOne({ // 유저 검색
        where: {
            user_name: req.body.user_name,
            email: req.body.email
        }
    }).then(function(user) {
        if(user !==null) {
            var result = {};
            result.user_id = user.user_id;
            res.send(result);
        }
        else{
            res.send({
                result: false
            });
        }
    });
});

router.post('/findPw', function(req, res, next) {
    models.User.findOne({
        where: {
            user_id: req.body.user_id,
            user_name: req.body.user_name
        }
    }).then(function(user) {
        if( user === null) 
            res.send({ mailSuccess: false, noDataFound: true });
        else {
            function getRandomPassword(length) {
                var password = "";
                for(var i=0; i<length; i++) {
                    var baseChar;
                    var randNum = Math.floor(Math.random()*3);
                    if( randNum == 0 )
                        baseChar = "0".charCodeAt(0);
                    else if( randNum == 1 )
                        baseChar = "a".charCodeAt(0);
                    else
                        baseChar = "A".charCodeAt(0);

                    if( randNum != 0 )
                        randNum = Math.floor(Math.random()*26);
                    else
                        randNum = Math.floor(Math.random()*10);


                    baseChar += randNum;
                    password += String.fromCharCode(baseChar);
                }

                return password;
            }

            // 랜덤한 비밀번호를 만들고 DB에 입력
            var newPassword = getRandomPassword(8);
            user.set('password', sha256(newPassword));


            // SMTP를 이용해 생성된 비밀번호 메일로 전송
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.id,
                    pass: config.email.password
                }
            });
            transporter.sendMail({
                 to: user.email,
                 subject: '[SOSC] ' + user.user_name + '님의 임시 비밀번호입니다.',
                 text: newPassword + ' 로 로그인 하신 후 비밀번호를 변경해주세요.'
            }, function (error, response) {
                var resData;
                // 이상없이 메일이 갔을 경우 DB 내용 최종 변경, 아닐 경우 에러처리
                if( error ) {
                    resData = { mailSuccess : false };
                    console.log(error);
                } else {
                    resData = { mailSuccess : true };
                    user.save();
                }
                transporter.close();
                res.send(resData);
            });
        }
    });

});

router.post('/uploader', multipartMiddleware, function(req, res) {
    fs.readFile(req.files.upload.path, function (err, data) {
        var file_name = Date.now() + "-" + req.files.upload.name;
        var file_path = path.join(config.db.upload_path, 'images', file_name);
        mkdirp(path.join(config.db.upload_path, 'images'), function(err) {
            fs.writeFile(file_path, data, function (err) {
                if(!err) {
                    html = "";
                    html += "<script type='text/javascript'>";
                    html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                    html += "    var url     = \"/"+file_path.split("\\").join("/")+"\";";
                    html += "    var message = \"Uploaded file successfully\";";
                    html += "";
                    html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                    html += "</script>";
                    res.send(html);
                }
            });
        });
    });
});

//layout
router.get('/main', function(req, res, next) {
    res.render('main_layout', { title: config.title });
});


router.get('/admin', loadUser, function(req, res, next) {
    res.render('admin_layout', { title: config.title });
});


module.exports = router;