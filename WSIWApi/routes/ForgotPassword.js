/* eslint-disable max-len */
/* eslint-disable no-console */
var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const mysql = require('mysql');
const config = require('../config/dbconfig');



const connection = mysql.createConnection(config.db);
/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     tags:
 *       - Users
 *     name: Forgot Password
 *     summary: Sends an email with a reset password link when a user inevitably forgets their password
 *     consumes:
 *       - application/json
 *     parameters:
 *      - name: body
 *        in: body
 *        schema:
 *          $ref: '#/definitions/User'
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *        required:
 *          - email
 *     responses:
 *       '200':
 *         description: Reset email sent
 *       '400':
 *         description: Email required
 *       '403':
 *         description: Email not found in db
 *
 */
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/auth');

[]
router.put('/forgotPassword', function(request,res, next) {
	// Capture the input fields
	let email = request.body.email;
	// Ensure the input fields exists and are not empty
	if (email!="") {
    //const hashedPassword = bcrypt.hashSync(password,10);
    const token = crypto.randomBytes(20).toString('hex');
    let dt = new Date();
    dt.setHours(dt.getHours() + 2);
    var dateHour = dt.toISOString().split('T')[0]+' '+dt.toTimeString().split(' ')[0];       
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('UPDATE admin SET resetPasswordToken = ?,resetPasswordExpires = ? WHERE email = ? ;', [token,dateHour,email], async function(error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.affectedRows > 0) {
            // const transporter = nodemailer.createTransport({
            // service: 'gmail',
            // host: "smtp.gmail.com",
            // auth: {
            //     user: 'wsiwtest@gmail.com',
            //     pass: 'abzyretrahpmhaoe',
            // },
            // });
            // const mailOptions = {
            // from: 'noreply@whatshouldiwear.com',
            // to: email,
            // subject: 'Link To Reset Password',
            // text:
            //     'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            //     + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            //     + `http://localhost:3000/reset/${token}\n\n`
            //     + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            // };
            // //console.log('sending mail');
            // transporter.sendMail(mailOptions, (err, response) => {
            // if (err) {
            //     console.error('there was an error: ', err);
            // } else {
            //     //console.log('here is the res: ', response);
            //     res.status(200).json('recovery email sent');
            // }
            // });
            res.status(200).send({tokenid:token});
        } else {
            res.status(403).send('Error ! Please try again');
        }			
        res.end();
    });
	} else {
		res.status(403).send('Please enter email id!');
		res.end();
	}
});
router.post('/checkUser', function(request,res, next) {
	// Capture the input fields
	let email = request.body.email;
	// Ensure the input fields exists and are not empty
	if (email!='') {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM admin WHERE email = ? ', [email], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) { 
				res.status(200).send({message:'valid data'});
			} else {
				res.status(200).send({message:'email not in db'});
			}			
			res.end();
		});
	} else {
		res.status(200).send({message:'Please enter Username and Password!'});
		res.end();
	}
});
module.exports = router;
