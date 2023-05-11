var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../middleware/auth');
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);

router.get('/getClothCategory', function(req, res, next) {
    connection.query('SELECT * FROM clothing_category;', function(error, results, fields) {
        if(results.length>0){
            //console.log(results);
            res.send(results);
        }
    });
});
router.post('/addClothingCategory',verifyToken, function(request,res, next) {
	let category_name = request.body.category_name;
	// Ensure the input fields exists and are not empty
	if (category_name!='' ) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO clothing_category(category_name) VALUES (?) ', [category_name], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.affectedRows>0) {   
				res.status(200).send({message:'clothing category created'});
			} else {
				res.status(403).send({message:'error'});
			}			
			res.end();
		});
	} else {
		res.status(403).send({message:'Please provide clothing category details!'});
		res.end();
	}
});
router.put('/editClothCategory',verifyToken, function(request,res, next) {
	let category_name = request.body.category_name;
    let clothing_category_id = request.body.clothing_category_id
	// Ensure the input fields exists and are not empty
	if (category_name!='' ) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('UPDATE clothing_category SET category_name = ? WHERE clothing_category_id = ? ;', 
        [category_name,clothing_category_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.affectedRows > 0) {
                //console.log('password updated');
                res.status(200).send({ message: 'category '+ category_name + ' is updated' });
            } else {
                //console.error('no user exists in db to update');
            res.status(403).send({ message: 'error updating '+category_name +'category_name' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide all clothing category details!'});
		res.end();
	}
});
router.delete('/deleteClothingCategory/:id',verifyToken, function(request,res, next) {
	let clothing_category_id = request.params.id;
	// Ensure the input fields exists and are not empty
	if (request.params.id > 0) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('DELETE FROM clothing_category WHERE clothing_category_id = ? ;', [clothing_category_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error)  if (error) {	
                res.status(409).send({ message: 'This record is already in use. You cannot delete it.' });	
            }
            else {
                res.status(200).send({ message: 'clothing category id '+clothing_category_id +' is deleted' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide clothing category id!'});
		res.end();
	}
});
module.exports = router;
