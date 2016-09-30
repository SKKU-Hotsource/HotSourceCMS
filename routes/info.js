var express = require('express');
var router = express.Router();
var models = require('../models');
var session = require('express-session');

//info write & modify
router.get('/:id', function(req, res) {
    models.Post.findOne({
        where: {
            categoryId : req.params.id
        }
    }).then(function(boardPost) {
        if (boardPost !== null) {
            //post is already existed. just send!
            res.send(boardPost);
        }else {
            //post is not existed. Make post and send it!
            var result = {};
            var request = {
                title: "Info" + req.params.id,
                CategoryId: req.params.id,
                contents : "",
                author : req.session.user.user_name 
            };
            models.Post.create(request).then(function(boardInfo){
                res.send(boardInfo);
            });
        }
    });
});

//info update
router.put('/:id',  loadUser, function(req, res) {
    models.Post.findOne({
        where: {
            CategoryId: req.params.id
        }
    }).then(function(boardPost){
        boardPost.updateAttributes(req.body);
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