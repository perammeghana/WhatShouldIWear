var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../middleware/auth');
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);

router.get('/getPreferenceFeel', function(req, res, next) {
    connection.query("SELECT * FROM preference where preference_category = 'Feel';", function(error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});
router.get('/getPreferenceSport', function(req, res, next) {
    connection.query("SELECT * FROM preference where preference_category = 'Sport';", function(error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});
router.get('/getPreference', function(req, res, next) {
    connection.query("SELECT * FROM preference;", function(error, results, fields) {
        if (error) throw error;
        else {
            res.send(results);
        }
    });
});
router.post('/addPreference',verifyToken, function(request,res, next) {
	let preference = request.body.preference;
    let preference_category = request.body.preference_category;
	// Ensure the input fields exists and are not empty
	if (preference!='' && preference_category!='') {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO preference(preference, preference_category) VALUES (?,?) ', 
        [preference,preference_category], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.affectedRows>0) {   
				res.status(200).send({message:'preference created'});
			} else {
				res.status(403).send({message:'error'});
			}			
			res.end();
		});
	} else {
		res.status(403).send({message:'Please provide all preference details!'});
		res.end();
	}
});
router.put('/editPreference',verifyToken, function(request,res, next) {
	let preference = request.body.preference;
    let preference_category = request.body.preference_category;
    let preference_id = request.body.preference_id;
	// Ensure the input fields exists and are not empty
	if (preference!='' && preference_category!='' && preference_id!='') {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('UPDATE preference SET preference = ?, preference_category = ? WHERE preference_id = ? ;', 
        [preference,preference_category,preference_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.affectedRows > 0) {
                //console.log('password updated');
                res.status(200).send({ message: 'preference id '+ preference_id + ' is updated' });
            } else {
                //console.error('no user exists in db to update');
            res.status(403).send({ message: 'error updating '+preference_id +' preference id' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide all preference details!'});
		res.end();
	}
});
router.delete('/deletePreference/:id', verifyToken, function(request,res, next) {
	let preference_id = request.params.id;
	// Ensure the input fields exists and are not empty
	if (request.params.id > 0) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('DELETE FROM preference WHERE preference_id = ? ;', [preference_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {	
                res.status(409).send({ message: 'Record already in use' });	
            }
            else {
                res.status(200).send({ message: 'preference id '+preference_id +' is deleted' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide preference id!'});
		res.end();
	}
});
module.exports = router;
