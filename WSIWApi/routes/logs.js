var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);

router.get('/getcronlogs', function(req, res, next) {
    connection.query('select * from cronlogs order by logid DESC;', function(error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send({message:'Error'});
            return;
        }
        if(results.length>0){
            res.send(results);
        }
    });
});
module.exports = router;
