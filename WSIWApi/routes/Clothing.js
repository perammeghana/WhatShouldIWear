var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../middleware/auth');
const config = require('../config/dbconfig');
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'images')
	},
	filename: (req, file, cb) => {
	  cb(null, file.originalname)
	},
  })
  
  const upload = multer({ storage: storage })


const connection = mysql.createConnection(config.db);



router.get('/getClothing', function(req, res, next) {
    connection.query('SELECT * FROM clothing;', function(error, results, fields) {
        if(results.length>0){
            //console.log(results);
            res.send(results);
        }
    });
});
router.get('/getClothingByCategory', function(req, res, next) {
    const categoryId = req.query.id;
	
    connection.query('SELECT * FROM clothing WHERE clothing_category_id = ?;', [categoryId], function(error, results, fields) {
        if (error) {
            throw error;
        }
        res.send(results);
    });
});



router.post('/addClothing', upload.single('image'), verifyToken, function(req, res) {
	const clothing_type = req.body.clothing_type;
	const clothing_image_path = req.file.path;
	const clothing_category_id = req.body.clothing_category_id;
	if (clothing_type && clothing_image_path && clothing_category_id) {
	  const imgsrc = 'https://api.mikebelus.net/' + clothing_image_path;
  
	  connection.query(
		'INSERT INTO clothing(clothing_type, clothing_image_path, clothing_category_id) VALUES (?,?,?) ',
		[clothing_type, imgsrc, clothing_category_id],
		function(error, results, fields) {
		  if (error) {
			console.error(error);
			res.status(500).send({ message: 'Error inserting clothing.' });
		  } else {
			res.status(200).send({ message: 'Clothing created.' });
		  }
		}
	  );
	} else {
	  res.status(400).send({ message: 'Please provide all clothing details.' });
	}
  });
  router.put('/editClothing', upload.single('image'), verifyToken, function(request,res, next) {
    let clothing_id = request.body.clothing_id;
	let clothing_type = request.body.clothing_type;
    let clothing_image_path = request?.file?.filename;
    let clothing_category_id = request.body.clothing_category_id;
    //let category_name = request.body.category_name;
	// Ensure the input fields exists and are not empty
	if (clothing_type  && clothing_category_id) {
        const imgsrc = "https://api.mikebelus.net/images/"+  clothing_image_path;
		console.log(imgsrc,"imgsrc")
		// Execute SQL query that'll select the account from the database based on the specified username and password
		let sql ;
        let values= []
        if(clothing_image_path){
sql='UPDATE clothing SET clothing_type = ?, clothing_image_path = ?, clothing_category_id = ? WHERE clothing_id = ? ;'
values= [clothing_type,imgsrc,clothing_category_id,clothing_id]
        }
        else{
            sql='UPDATE clothing SET clothing_type = ?, clothing_category_id = ? WHERE clothing_id = ? ;'
    values= [clothing_type,clothing_category_id,clothing_id]
        }
        connection.query(sql, 
            values , function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) return res.status(403).send({message:'error'});
            // If the account exists
            if (results.affectedRows > 0) {
                //console.log('password updated');
                res.status(200).send({ message: 'clothing_id id '+ clothing_id + ' is updated' });
            } else {
                //console.error('no user exists in db to update');
            res.status(403).send({ message: 'error updating '+clothing_id +'location id' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide all clothing details!'});
		res.end();
	}
});
router.delete('/deleteClothing/:id',verifyToken, function(request,res, next) {
	let clothing_id = request.params.id;
	// Ensure the input fields exists and are not empty
	if (request.params.id > 0) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('DELETE FROM clothing WHERE clothing_id = ? ;', [clothing_id], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) {
                res.status(409).send({ message: 'This record is already in use. You cannot delete it.' });
            }
            else {
                res.status(200).send({ message: 'clothing id '+clothing_id +' is deleted' });
            }			
            res.end();
        });
	} 
    else {
		res.status(403).send({message:'Please provide clothing id!'});
		res.end();
	}
});
module.exports = router;
