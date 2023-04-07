var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM admin;', function(error, results, fields) {
        if(results.length>0){
            res.send('API is working properly');
        }
    });
});
router.post('/', function(request,res, next) {
	let email = request.body.email;
	let password = request.body.password;
	let privateKey = 'somekey';
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM admin WHERE email = ? ', [email], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				const comparison = await bcrypt.compare(password, results[0].password);
				if(comparison){
					console.log("comp true")
					token =  jwt.sign({ email:email }, privateKey,{ expiresIn: '1h'})
					console.log(token);
					if(token){
					return res.status(200).send({
						token:token,
						message:'valid data'});
					}
					//return res.json({token:token, username:username})
				}  
				else
				return res.status(403).send({message:'Incorrect Username and/or Password!'});
			} else {
				return res.status(403).send({message:'Incorrect Username and/or Password!'});
			}			
			res.end();
		});
	} else {
		return res.status(200).send({message:'Please enter email and Password!'});
		res.end();
	}
});
// router.put('/', function(request,res, next) {
// 	// Capture the input fields
// 	let email = request.body.email;
// 	let oldPassword = request.body.oldpassword;
// 	let newPassword=request.body.newPassword;
// 	// Ensure the input fields exists and are not empty
// 	if (email!="" && oldPassword!="" && newPassword!="") {
// 		const hashedPassword = bcrypt.hashSync(newPassword,10);
// 		// Execute SQL query that'll select the account from the database based on the specified username and password
// 		connection.query('UPDATE admin SET admin_password = ? WHERE admin_username = ? ;', [hashedPassword, username], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			if(results.affectedRows>0){
// 				res.send({message:'updated'});
// 			}
// 			else{
// 				res.send({message:'error'});
// 			}
// 			res.end();
// 		});
// 	} else {
// 		res.status(200).send({message:'Please enter Username and Password!'});
// 		res.end();
// 	}
// });
module.exports = router;