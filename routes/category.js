var express = require('express');
var router = express.Router();
var models = require('../models');

/* If you want to modify the type of categories, modify the below list. */
var typeList = ['root', 'info', 'board', 'video', 'paper'];

/* Below Functions are not used in CategroryCtrl.js */
router.get('/', function(req, res) {
    models.Category.findAll({
        order : 'id ASC'
    }).then(function(categorySvArr) {
        var categoryCliArr = [];
        categorySvArr.forEach(function(categorySv) {
            var categoryCli = {};
            categoryCli.id = categorySv.id;
            categoryCli.category_name = categorySv.category_name;
            categoryCli.parent_seq = categorySv.parent_seq;
            // categoryCli.type = categorySv.type;
            switch(categorySv.type){
                    case 1:
                        categoryCli.type="info";
                        break;
                    case 2:
                        categoryCli.type="board";
                        break;
                    case 3:
                        categoryCli.type="video";
                        break;
                    default:
                        break;
                }
            categoryCli.createdAt = categorySv.createdAt;
            categoryCli.updatedAt = categorySv.updatedAt;
            categoryCliArr.push(categoryCli);
        });
        res.contentType('application/json');
        res.send(categoryCliArr);
    });
});

router.get('/typelist', function(req, res) {
    res.send(typeList);
});

router.get('/header', function(req, res) {
    models.sequelize.query('SELECT * FROM header').then(function(data) {
        for(var i = 0; i < data[0].length; ++i){
            switch(data[0][i].type1){
                    case 1:
                        data[0][i].type1="info";
                        break;
                    case 2:
                        data[0][i].type1="board";
                        break;
                    case 3:
                        data[0][i].type1="video";
                        break;
                    default:
                        break;
                }
            switch(data[0][i].type2){
                    case 1:
                        data[0][i].type2="info";
                        break;
                    case 2:
                        data[0][i].type2="board";
                        break;
                    case 3:
                        data[0][i].type2="video";
                        break;
                    default:
                        break;
                }
            switch(data[0][i].type3){
                    case 1:
                        data[0][i].type3="info";
                        break;
                    case 2:
                        data[0][i].type3="board";
                        break;
                    case 3:
                        data[0][i].type3="video";
                        break;
                    default:
                        break;
                }
            switch(data[0][i].type4){
                    case 1:
                        data[0][i].type4="info";
                        break;
                    case 2:
                        data[0][i].type4="board";
                        break;
                    case 3:
                        data[0][i].type4="video";
                        break;
                    default:
                        break;
                }
        }
        res.json(data[0]); 
    });
});

/*
* @author   : 강성필 hwhale
* @param    : no parameter
* @return   : object tree / a json data of node objects which has the data of existing cateogories.
* @summary  :
*   Send the data of the all categoris as the form of json tree to the server.
*   It transforms the data from an array to a tree
*/
router.get('/sub', function(req, res) {
    var findNodeInTree = function(tree, id) {
        if( tree == null )
            return null;
        else if( tree.id == id )
            return tree;
        
        for(var i=0; i<tree.nodes.length; i++) {
            var findId = findNodeInTree(tree.nodes[i], id);
            if( findId != null )
                return findId;
        }
        return null;
    };

    models.sequelize.query(
        'SELECT id, category_name as title, parent_seq, type FROM category ORDER BY parent_seq, sequence, level'
    ).then(function(category_db) {
        resTree = [];
        resTree.push({"id":-1, "title":"hidden_root", "parent_seq":-1, "type":0, nodes: []});

        category_db[0].forEach(function(category) {
            category.nodes = [];
            category.typeString = typeList[category.type];
            var parentNode;
            if( category.parent_seq == null )
                parentNode = findNodeInTree(resTree[0], -1);
            else
                parentNode = findNodeInTree(resTree[0], category.parent_seq);


            parentNode.nodes.push(category);
        });

        res.json(resTree);
    });
});

/*
* @author   : 강성필 hwhale
* @param    : no parameter
* @return   : object data_base / an array of node objects.
* @summary  :
*   Save the data of the all categoris as the form of json tree to the server.
*   It transforms the data from a tree to an array
*/
router.put('/sub', loadUser, function(req, res) {
    var data = req.body;
    
    // 바뀐 트리에 존재하지 않는 노드 찾아서 삭제
    function getExistId(idList, cur_arr) {
        for( var i in cur_arr ) {
            if( cur_arr[i].id != null )
                idList.push(cur_arr[i].id);
            getExistId(idList, cur_arr[i].nodes);
        }
    }

    var idList = [];
    getExistId(idList, data.nodes);

    var condition = {};
    if( idList.length != 0 )
        condition.where = { $not: [{ id: idList }] };
    var changedId = [];

    models.Category.findAll(condition)
    .then( function ( rows ) {
        rows.forEach( function (row) {
            row.destroy();
        });
    });

    // 트리를 돌며 노드 업데이트 및 추가
    function db_tree(cur_id, cur_arr, prev_sec, level) {
        var sec = prev_sec + 1;
        level++;
        cur_arr.forEach( function (node) {

            var parentId = cur_id;
            if( cur_id == 0 )
                parentId = null;

            if( node.id != null ) {
                models.sequelize.query("UPDATE category SET "
                    +"category_name='"+node.title+"', "
                    +"parent_seq="+parentId+", "
                    +"sequence="+sec+", "
                    +"level="+level+", "
                    +"type="+node.type + " WHERE id="+node.id
                ).then( function () {
                    if( typeof node.nodes !== 'undefined' )
                        db_tree(node.id, node.nodes, 0, level);
                });
            }
            else {
                models.Category.create({
                    category_name: node.title,
                    parent_seq: parentId,
                    sequence: sec,
                    type: node.type,
                    level: level
                }).then( function ( row ) {
                    if( typeof node.nodes !== 'undefined' )
                        db_tree(row.getDataValue('id'), node.nodes, 0, level);
                });
            }
            sec++;
        })
    }
    db_tree(0, data.nodes, 0, 0);
    res.send({error: false});
    //res.send(data_base);
});

/* Below functions are not used in the CategoryCtrl */
router.post('/', loadUser, function(req, res) {
    //TODO:session checkA
    models.Category.findOne({
        where: {
            id: req.body.parent_seq
        }
    }).then(function(data){
        if (data !== null) {
            models.Category.create(req.body).then(function(){
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
 

router.get('/:id', function(req, res) {
    models.Category.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(category) {
        if (category !== null) {
            res.contentType('application/json');
            res.send(category);
        } else {
            res.send({
                error: true
            });
        }
    });
});

router.put('/:id', loadUser, function(req, res) {

    models.Category.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(category) {
        if (category !== null) {
            category.updateAttributes(req.body).then(function() {
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

/*
* @author   : 강성필 hwhale
* @param    : int id / specify the popup you want to delete
* @return   : object error / send 'true' if an error occured.
* @summary  :
*   Delete the existing popup you want to delete.
*/
router.delete('/:id', loadUser, function(req, res) {
    models.Category.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(category) {
        if (category !== null) {
            category.destroy().then(function() {
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

/*
* @author   : 강성필 hwhale
* @param    : routing function
* @return   : no return
* @summary  :
*   A functions for security. If client who is not admin try to use the important function,
*   you can deny the request by using it.
*/
function loadUser(req,res,next) {
  // res.redirect('/');
  // // You would fetch your user from the db
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
