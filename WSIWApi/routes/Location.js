var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../middleware/auth');
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);

router.get('/getLocations', function(req, res, next) {
    connection.query('SELECT * FROM location;', function(error, results, fields) {
        if(results.length>0){
            //console.log(results);
            res.send(results);
            // res.send('API is working properly');
        }
    });
});
router.post('/addLocation', verifyToken, function(request,res, next) {
    let data = request.body;
    if (!Array.isArray(data)) {
        data = [data];
    }
    let insertValues = [];
    data.forEach((item) => {
        let postal_code = item.postal_code;
        let city = item.city;
        let state = item.state;
        let latitude = item.latitude;
        let longitude = item.longitude;
        let isAvailable = item.isAvailable;
        // Ensure the input fields exists and are not empty
        if (postal_code !== '' && city!='' && state!='' && latitude!=0 && longitude!=0 ) {
            insertValues.push([postal_code,city,state,latitude,longitude,isAvailable]);
        }
    });
    if (insertValues.length === 0) {
        res.status(403).send({message:'Please provide all location details!'});
        res.end();
        return;
    }
    // Execute SQL query that'll insert the location data into the database
    connection.query('INSERT INTO location(postal_code, city, state, latitude, longitude, isAvailable) VALUES ?', 
    [insertValues], function(error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) {
            console.error(error);
            res.status(500).send({message:'Error inserting data into database'});
            return;
        }
        // If the records are inserted successfully
        if (results.affectedRows>0) {   
            res.status(200).send({message:'location(s) created'});
        } else {
            res.status(403).send({message:'Error creating location(s)'});
        }           
        res.end();
    });
});

router.put('/editLocation', verifyToken, function(request,res, next) {
	let location_id = request.body.location_id;

    let isAvailable = request.body.isAvailable;
	// Ensure the input fields exists and are not empty
	if ( isAvailable!=''  ) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('UPDATE location SET isAvailable = ? WHERE location_id = ? ;', 
        [isAvailable,location_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.affectedRows > 0) {
                //console.log('password updated');
                res.status(200).send({ message: 'location id '+ location_id + ' is updated' });
            } else {
                //console.error('no user exists in db to update');
            res.status(403).send({ message: 'error updating '+location_id +'location id' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide all location details!'});
		res.end();
	}
});
router.delete('/deleteLocation/:id',verifyToken, function(request,res, next) {
	let location_id = request.params.id;
	// Ensure the input fields exists and are not empty
	if (request.params.id > 0) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('DELETE FROM location WHERE location_id = ? ;', [location_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            else {
                res.status(200).send({ message: 'location id '+location_id +' is deleted' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide location id!'});
		res.end();
	}
});
module.exports = router;
