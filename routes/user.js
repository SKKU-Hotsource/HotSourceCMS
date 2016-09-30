var express = require('express');
var router = express.Router();
var models = require('../models');
var sha256 = require('sha256');
var session = require('express-session');

// List
router.get('/', function(req, res) {
	models.User.findAll({
        order : 'id ASC'
    }).then(function(userSvArr) {
        var userCliArr = [];
        userSvArr.forEach(function(userSv) {
        	delete userSv.password;
            var userCli = {};
            userCli.id = userSv.id;
            userCli.user_id = userSv.user_id;
            userCli.user_name = userSv.user_name;
            userCli.email = userSv.email;
            userCli.type = userSv.type;
            userCli.createdAt = userSv.createdAt;
            userCli.updatedAt = userSv.updatedAt;
            userCliArr.push(userCli);
        });
        res.contentType('application/json');
        res.send(userCliArr);
    });
});

// Create
router.post('/', function(req, res) {
	models.User.findOne({
	    where: {
	        user_id: req.body.user_id
	    }
	}).then(function(user){
	    if (user === null) {
	        req.body.password = sha256(req.body.password);
            req.body.type = 1;

            models.User.create(req.body).then(function() {
                res.send({
                    error: false
                });
            }).catch( function ( error ) {
                res.send({ emailConflict: true });
            });
	    } else {
	    	res.send({ idConflict: true });
	    }
	});

});

// Read
router.get('/:id', function(req, res) {
	models.User.findOne({
        where: {
            user_id: req.params.id
        }
    }).then(function(user) {
        if (user !== null) {
            var userCli ={};
            userCli.id = user.id;
            userCli.user_id = user.user_id;
            userCli.user_name = user.user_name;
            userCli.email = user.email;
            userCli.type = user.type;
            userCli.createdAt = user.createdAt;
            userCli.updatedAt = user.updatedAt;

            res.contentType('application/json');
            res.send(userCli);
        } else {
            res.send({
                error: true
            });
        }
    });
});

// 개인정보 변경
router.put('/:id', function(req, res) {
	req.body.password = sha256(req.body.password);
    models.User.findOne({
        where: {
            user_id: req.params.id,
			password: req.body.password
        }
    }).then(function(user) {
        if (user !== null) {
            user.updateAttributes(req.body).then(function() {
                res.send({
                    error: false
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});

//password 변경
router.put('/password/:id', function(req, res) {
    models.User.findOne({
        where: {
            user_id: req.params.id,
            password: sha256(req.body.oldPassword)
        }
    }).then(function(user) {
        var result = {};
        req.body.password = sha256(req.body.password);
        if (user !== null) {
            user.updateAttributes(req.body).then(function() {
                res.send({
                    error: false
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});

router.put('/admin/:id', loadUser, function(req, res) {
    models.User.findOne({
        where: {
            user_id: req.params.id
        }
    }).then(function(user) {
        if(req.body.password)
            req.body.password = sha256(req.body.password);
        if (user !== null) {
            user.updateAttributes(req.body).then(function() {
                res.send({
                    error: false
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});

// Delete - admin 쪽 회원 탈퇴
router.delete('/:id', loadUser, function(req, res) {
	models.User.findOne({
        where: {
            user_id: req.params.id
        }
    }).then(function(user) {
        if (user !== null) {
            user.destroy().then(function() {
                res.send({
                    error: false
                });
            });
        } else {
            res.send({
                error: true
            });
        }
    });
});

//회원 자체 탈퇴
router.delete('/', function(req, res) {
    models.User.findOne({
        where: {
            user_id: req.session.user.user_id
        }
    }).then(function(user) {
        if (user !== null) {
            user.destroy().then(function() {
                delete req.session.user;
                res.send({
                    error: false
                });
                //res.redirect('"/main#/"');
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
