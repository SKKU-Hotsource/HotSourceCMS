var express = require('express');
var router = express.Router();
var models = require('../models');

// List
router.get('/list/:categoryId', function(req, res) {
	models.Paper.findAll({
        where : {
            CategoryId:req.params.categoryId
        },
        order : 'publish_date DESC, id ASC'
    }).then(function(paperSvArr) {
        var paperCliArr = [];
        paperSvArr.forEach(function(paperSv) {
            var paperCli = {};
            paperCli.id = paperSv.id;
            paperCli.title = paperSv.title;
            paperCli.lead_author = paperSv.lead_author;
            paperCli.corresponding_author = paperSv.corresponding_author;
            paperCli.co_author = paperSv.co_author;
            paperCli.url = paperSv.url;
            paperCli.publication_name = paperSv.publication_name;
            paperCli.count_of_origin = paperSv.count_of_origin? "international":"domestic";
            paperCli.publication_type = paperSv.publication_type? "journal":"conference";
            if(paperCli.publication_type == "journal") {
            	paperCli.vol = paperSv.vol;
            	paperCli.no = paperSv.no;	
            	paperCli.format = paperSv.format? "online":"paper";
            	switch(paperSv.citaion_index){
                    case 1:
                        paperCli.citaion_index="SCI";
                        break;
                    case 2:
                        paperCli.citaion_index="SCIE";
                        break;
                    case 3:
                        paperCli.citaion_index="ETC";
                        break;
                    default:
                        break;
                }
            }            
            paperCli.pp = paperSv.pp;
            paperCli.publish_date = paperSv.publish_date;
            paperCli.createdAt = paperSv.createdAt;
            paperCli.updatedAt = paperSv.updatedAt;
            paperCli.CategoryId = paperSv.CategoryId;
            paperCliArr.push(paperCli);
        });
        res.contentType('application/json');
        res.send(paperCliArr);
    });
});
// Create
router.post('/', loadUser, function(req, res) {
    models.Paper.create(req.body).then(function(){
        res.send({
            error: false
        });
    });
});
 
// Read
router.get('/:id', function(req, res) {
	models.Paper.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(paper) {
        if (paper !== null) {
        	res.contentType('application/json');
            res.send(paper);
        } else {
            res.send({
                error: true
            });
        }
    });
});
 
// Update
router.put('/:id', loadUser, function(req, res) {
	models.Paper.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(paper) {
        if (paper !== null) {
            paper.updateAttributes(req.body).then(function() {
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
 
// Delete
router.delete('/:id', loadUser, function(req, res) {
	models.Paper.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(paper) {
        if (paper !== null) {
            paper.destroy().then(function() {
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