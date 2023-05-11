var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const verifyToken = require('../middleware/auth');
const config = require('../config/dbconfig');
const axios = require('axios');
const path = require('path');
const { spawn } = require('child_process');

const connection = mysql.createConnection(config.db);
router.get('/defaultCity/:latitude/:longitude', function (req, res, next) {
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAKvpQHMJ5tFlPqszuQ-cm96wBXmIefsbY`;
    
    async function get_clothes_data() {
        try {
            let mydata = await axios.get(url);           
            let address_components = mydata.data.results[0]["address_components"];         
            let data = {"city":"", "state": "", "country":"", "postal_code" : ""}
            address_components.forEach((component) => {              
                const types = component.types;
                if (types.includes("locality")) {
                    data.city = component.short_name;
                //timez = moment.tz(city);
                }
                if (types.includes("administrative_area_level_1")) {
                    data.state = component.short_name;
                }
                if (types.includes("country")) {
                    data.country = component.short_name;
                }
                if(types.includes("postal_code")){
                    data.postal_code = component.short_name;
                }
            });
            res.send(data);
        } catch (err) {
            console.log(err)
        }
    }
    get_clothes_data();
});
router.get('/getLocations', function(req, res, next) {
    connection.query('SELECT * FROM location;', function(error, results, fields) {
        if(results.length>0){
            //console.log(results);
            res.send(results);
            // res.send('API is working properly');
        }
    });
});
router.get('/checkLocation', function(req, res, next) {
    let city = req.query.city;
    console.log(city)
    connection.query('SELECT * FROM location where city = ? and isAvailable = "Yes";',[city], function(error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send({message:'Error'});
            return;
        }
        if(results.length>0){
            //console.log(results);
            res.send(results[0]);
            // res.send('API is working properly');
        }
        else{
            res.status(200).send({message:'city does not exist'});
        }
    });
});
router.get('/checkLocationPostal', function(req, res, next) {
    let postal = req.query.postal;
    connection.query('SELECT * FROM location where postal_code = ? and isAvailable = "Yes";',[postal], function(error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send({message:'Error'});
            return;
        }
        if(results.length>0){
            //console.log(results);
            res.send(results[0]);
            // res.send('API is working properly');
        }
        else{
            res.status(200).send({message:'city does not exist'});
        }
    });
});
router.get('/checkLocationPostalDisabled', function(req, res, next) {
    let postal = req.query.postal;
    connection.query('SELECT * FROM location where postal_code = ? and isAvailable = "No";',[postal], function(error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send({message:'Error'});
            return;
        }
        if(results.length>0){
            //console.log(results);
            res.send(results[0]);
            // res.send('API is working properly');
        }
        else{
            res.status(200).send({message:'city does not exist'});
        }
    });
});
router.post("/addLocation", function (request, res, next) {
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
      if (
        postal_code !== "" &&
        city != "" &&
        state != "" &&
        latitude != 0 &&
        longitude != 0
      ) {
        insertValues.push([
          postal_code,
          city,
          state,
          latitude,
          longitude,
          isAvailable,
         new Date().toISOString().replace('Z', '').replace('T', ' ')
        ]); //7th parameter would new Date()
      }
    });
 
    if (insertValues.length === 0) {
      res.status(403).send({ message: "Please provide all location details!" });
      res.end();
      return;
    }
    // Execute SQL query that'll insert the location data into the database
    connection.query(
      "INSERT INTO location(postal_code, city, state, latitude, longitude, isAvailable, lastUpdated) VALUES ?",
      [insertValues],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) {
          console.error(error);
          res.status(500).send({ message: "Error inserting data into database" });
          return;
        }
        // If the records are inserted successfully
        if (results.affectedRows > 0) {
          res.status(200).send({ message: "location(s) created" });
        } else {
          res.status(403).send({ message: "Error creating location(s)" });
        }
        res.end();
      }
    );
  });
  

router.put("/editLocation", function (request, res, next) {
    let location_id = request.body.location_id;
  
    let isAvailable = request.body.isAvailable;
    let currentTime=   new Date().toISOString().replace('Z', '').replace('T', ' ')
    // Ensure the input fields exists and are not empty
    if (isAvailable != "") {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      //connection.query('UPDATE location SET isAvailable = ? WHERE location_id = ? ;',
  
      connection.query(
        "UPDATE `location` SET `isAvailable` = ?, `lastUpdated` = ? WHERE `location_id` = ?;",
        [isAvailable,currentTime, location_id],
        function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists
          if (results.affectedRows > 0) {
            console.log("Time updated---------------------------");
            res
              .status(200)
              .send({ message: "location id " + location_id + " is updated" });
          } else {
            //console.error('no user exists in db to update');
            res
              .status(403)
              .send({ message: "error updating " + location_id + "location id" });
          }
          res.end();
        }
      );
    } else {
      res.status(403).send({ message: "Please provide all location details!" });
      res.end();
    }
  });
  router.delete(
    "/deleteLocation/:id",
    verifyToken,
    function (request, res, next) {
      let location_id = request.params.id;
      // Ensure the input fields exists and are not empty
      if (request.params.id > 0) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query(
          "DELETE FROM location WHERE location_id = ? ;",
          [location_id],
          function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            else {
              res
                .status(200)
                .send({ message: "location id " + location_id + " is deleted" });
            }
            res.end();
          }
        );
      } else {
        res.status(403).send({ message: "Please provide location id!" });
        res.end();
      }
    }
  );
router.delete(
    "/deleteLocationBulk",
    verifyToken,
    function (request, res, next) {
      let location_ids = request.body.location_ids;
  
      // Ensure the input fields exists and are not empty
      if (location_ids && location_ids.length > 0) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
  
        connection.query(
          "DELETE FROM location WHERE location_id IN (?)",
          [location_ids],
          function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            else {
              res.status(200).send({ message: "Items deleted successfully" });
            }
            res.end();
          }
        );
      } else {
        res.status(403).send({ message: "Please provide location ids!" });
        res.end();
      }
    }
  );
  
  router.put("/editLocationBulk", verifyToken, function (request, res, next) {
    let location_ids = request.body.location_ids;
  
   
    let isAvailable = request.body.isAvailable ===true? "Yes":"No";
    // Ensure the input fields exists and are not empty
    if (isAvailable != "") {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      //connection.query('UPDATE location SET isAvailable = ? WHERE location_id = ? ;',
      let currentDate=  new Date().toISOString().replace('Z', '').replace('T', ' ')
      connection.query(
        "UPDATE `location` SET `isAvailable` = ?, `lastUpdated` = ? WHERE `location_id` IN (?)",
        [isAvailable,currentDate, location_ids],
        function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists
          if (results.affectedRows > 0) {
            console.log("Time updated---------------------------");
            res.status(200).send({ message: "locations updated successfully" });
          } else {
            //console.error('no user exists in db to update');
            res.status(403).send({ message: "error in updating locations" });
          }
          res.end();
        }
      );
    } else {
      res.status(403).send({ message: "Please provide all location details!" });
      res.end();
    }
  });
router.get('/addNewData/:id', function(req, res, next) {
    let location_id = req.params.id;
    const scriptPath = path.join(__dirname, 'weather.py');
    //const scriptPath = '/Users/meghana/Desktop/gitCodeWSIW/WhatShouldIWear/WSIWApi/routes/weather.py';
    const args = ['single', 'hourly',location_id];

    const pythonProcess = spawn('python3', [scriptPath, ...args]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send(`Python script exited with code ${code}`);
    });
});
module.exports = router;