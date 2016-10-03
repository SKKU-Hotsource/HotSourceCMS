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

/*
* @author   : 강성필 hwhale
* @param    : no parameter
* @return   : object popupList / list of the whole popups.
* @summary  :
*   Find the all popups and send them to the client.
*/
// popup과 관련된 서버사이드 함수
router.get('/list', function(req, res) {
    models.Popup.findAll({
        attributes: ['id', 'title', 'startDate', 'endDate'],
        order: 'id DESC'
    }).then(function (popupList) {
        popupList.forEach( function (val) {
            var getDateStr = function (date) {
                var dateStr = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                return dateStr;
            };
            val.startDate = getDateStr(val.startDate);
            val.endDate = getDateStr(val.endDate);
        });
        res.send(popupList);
    });
});

/*
* @author   : 강성필 hwhale
* @param    : no parameter
* @return   : object popupList / list of the whole popups.
* @summary  :
*   Find the popups which have to be shown today and send them to the client.
*/
router.get('/today', function(req, res, next) {
    models.Popup.findAll({
        where: {
            startDate: {$lte: models.sequelize.fn('CURDATE')},
            endDate: {$gte: models.sequelize.fn('CURDATE')} 
        }
    }).then(function(popupList) {
        res.send(popupList);
    }).catch(function() {
        res.send({error: false});
    });
});

/*
* @author   : 강성필 hwhale
* @param    : object data / datas that the DB need to save the popup.
              object file / image file you want to show in the popup.
* @return   : object error / send 'true' if an error occured.
* @summary  :
*   Upload a image and add a DB row to add a new popup.
*/
router.post('/add', upload.single('file'), loadUser, function(req, res) {
    models.Popup.create({
        title: req.body.title,
        image_src: "temp",
        path: req.body.path,
        width: req.body.width,
        height: req.body.height,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }).then(function(row) {
        var id = '';

        mkdirp(path.join(config.db.upload_path, 'popup'), function( err ) {
            if( err ) {
                row.destroy();
                res.send({error: true});
            }

            var newFilePath = path.join(config.db.upload_path, 'popup', Date.now()+'-'+req.file.originalname);
            fs.rename(req.file.path, newFilePath, function(err) {
                if( err ) {
                    row.destroy();
                    res.send({error: true});
                }
                else {
                    row.update({image_src: newFilePath});
                    res.send({error: false});
                }
            });
        });
    }).catch(function() {
        res.send({error: true});
    });
});

/*
* @author   : 강성필 hwhale
* @param    : int id / specify the popup you want to delete
* @return   : object error / send 'true' if an error occured.
* @summary  :
*   Delete the existing popup you want to delete.
*/
router.delete('/:popupId', loadUser, function(req, res) {
    models.Popup.findOne({where: {id: req.params.popupId}}).then(function (row) {
        if( row != null)
            row.destroy();
    });
    res.send({error: false});
});

/*
* @author   : 강성필 hwhale
* @param    : int id / specify the popup you want to modify
* @return   : object error / send 'true' if an error occured.
* @summary  :
*   Show about the popup you want to modify.
*/
router.get('/modify/:popupId', loadUser, function(req, res) {
    models.Popup.findOne({where: {id: req.params.popupId} }).then(function (row) {
        res.send(row);
    }).catch(function () {
        res.send({error: true});
    });
});

/*
* @author   : 강성필 hwhale
* @param    : int id / specify the popup you want to modify
*             object data / new values that are results of the modify.
* @return   : object error / send 'true' if an error occured.
* @summary  :
*   Show about the popup you want to modify.
*/
router.put('/', loadUser, function(req, res) {
    models.Popup.findOne({where: {id: req.body.id} }).then(function (row) {
        row.update(req.body.data);
    });
    res.send({error: false});
});

/*
* @author   : 강성필 hwhale
* @param    : routing function
* @return   : no return
* @summary  :
*   A functions for security. If client who is not admin try to use the important function,
*   you can deny the request by using it.
*/
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
