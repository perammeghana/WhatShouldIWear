var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const mysql = require('mysql');
const config = require('../config/dbconfig');
const verifyToken = require('../middleware/auth');



const connection = mysql.createConnection(config.db);

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// router.get('/getAdmin', function(req, res, next) {
//     connection.query('SELECT * FROM admin;', function(error, results, fields) {
//         if(results.length==0){
//             res.send('API is working properly');
//         }
//     });
// });
router.post('/newAdmin', verifyToken, function (request, res, next) {
    // Capture the input fields
    let fname = request.body.fname;
    let lname = request.body.lname;
    let email = request.body.email;
    let password = request.body.password;
    //res.send(username+password);
    // Ensure the input fields exists and are not empty
    if (email != "" && password != "" && fname != "" && lname != "") {
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('INSERT INTO admin(first_name,last_name,email,password) VALUES (?,?,?,?) ', [fname, lname, email, hashedPassword], async function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.affectedRows > 0) {
                res.status(200).send({ message: 'created' });
            } else {
                res.status(200).send({ message: 'error' });
            }
            res.end();
        });
    } else {
        res.status(200).send({ message: 'Please enter email and Password!' });
        res.end();
    }
});
router.post('/reset', function (request, res, next) {
    // Capture the input fields
    let resetPasswordToken = request.body.resetPasswordToken;
    let dt = new Date();
    let resetPasswordExpires = dt.toISOString().split('T')[0] + ' ' + dt.toTimeString().split(' ')[0];
    //let resetPasswordExpires = Date.now();
    // Ensure the input fields exists and are not empty
    if (resetPasswordToken != "") {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM admin WHERE resetPasswordToken = ? AND ? <= resetPasswordExpires;', [resetPasswordToken, resetPasswordExpires], async function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results != '') {
                res.status(200).send({
                    username: results[0].email,
                    message: 'password reset link a-ok',
                });
            } else {
                console.error('password reset link is invalid or has expired');
                res.status(403).send('password reset link is invalid or has expired');
            }
            res.end();
        });
    } else {
        res.status(403).send({ message: 'Invalid Token!' });
        res.end();
    }
});
router.put('/UpdatePassword', function (request, res, next) {
    // Capture the input fields
    let email = request.body.email;
    let resetPasswordToken = null;
    let resetPasswordExpires = null;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('UPDATE admin SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ? ;', [hashedPassword, resetPasswordToken, resetPasswordExpires, email], function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.affectedRows > 0) {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
        } else {
            console.error('no user exists in db to update');
            res.status(401).json('no user exists in db to update');
        }
        res.end();
    });
});
router.post('/checkUser', function (request, res, next) {
    // Capture the input fields
    let email = request.body.email;
    let resetPasswordToken = request.body.resetPasswordToken;
    let resetPasswordExpires = Date.now();
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM admin WHERE email = ? AND resetPasswordToken = ? AND ? <= resetPasswordExpires;', [email, resetPasswordToken, resetPasswordExpires], async function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results != '') {
            res.status(200).send({
                message: 'user exists in db',
            });
        } else {
            console.error('password reset link is invalid or has expired');
            res.status(403).send('password reset link is invalid or has expired');
        }
        res.end();
    });
});
module.exports = router;