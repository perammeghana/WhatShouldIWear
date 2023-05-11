var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const verifyToken = require("../middleware/auth");
const config = require("../config/dbconfig");

const connection = mysql.createConnection(config.db);

router.get("/getRecommends", function (req, res, next) {
  connection.query(
    "SELECT * FROM recommended;",
    function (error, results, fields) {
      if (results.length > 0) {
        //console.log(results);
        res.send(results);
      }
    }
  );
});
router.get("/getRecommendations", function (req, res, next) {
  let apparentTemp = req.query.apparentTemp;
  let sport_id = req.query.sport_id;
  let feel_id = req.query.feel_id;
  connection.query(
    "select clothing.Clothing_type,clothing.clothing_image_path, recommended.feel_id,recommended.sport_id from clothing join recommended on clothing.clothing_id=recommended.clothing_id  where apparent_temp_range_start <= ? and apparent_temp_range_end > ? and recommended.sport_id=? and recommended.feel_id=?;",[apparentTemp,apparentTemp,sport_id,feel_id],
    function (error, results, fields) {
      if (error) throw error;
      //if (results.length > 0) {
        //console.log(results);
        res.send(results);
      //}
    }
  );
});
router.post("/addRecommend", verifyToken, function (request, res, next) {
  let clothing_id = request.body.clothing_id;
  let clothing_category_id = request.body.clothing_category_id;
  let apparent_temp_range_start = request.body.apparent_temp_range_start;
  let apparent_temp_range_end = request.body.apparent_temp_range_end;
  let feel_id = request.body.feel_id;
  let sport_id = request.body.sport_id;
  console.log(feel_id)
  console.log(sport_id)
  // Ensure the input fields exists and are not empty
  if (
    clothing_id != 0 &&
    clothing_category_id != 0 &&
    apparent_temp_range_start != "" &&
    apparent_temp_range_end != "" &&
    feel_id !== '' &&
    sport_id!== '' 
  ) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "INSERT INTO recommended(clothing_id, clothing_category_id, apparent_temp_range_start, apparent_temp_range_end,feel_id,sport_id) VALUES (?,?,?,?,?,?) ",
      [
        clothing_id,
        clothing_category_id,
        apparent_temp_range_start,
        apparent_temp_range_end,
        feel_id,
        sport_id
      ],
      async function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.affectedRows > 0) {
          res.status(200).send({ message: "recommend created" });
        } else {
          res.status(403).send({ message: "error" });
        }
        res.end();
      }
    );
  } else {
    res.status(403).send({ message: "Please provide all recommend details!" });
    res.end();
  }
});
router.put("/editRecommend", verifyToken, function (request, res, next) {
  let recommended_id = request.body.recommended_id;
  let clothing_id = request.body.clothing_id;
  let clothing_category_id = request.body.clothing_category_id;
  let apparent_temp_range_start = request.body.apparent_temp_range_start;
  let apparent_temp_range_end = request.body.apparent_temp_range_end;
  let feel_id = request.body.feel_id;
  let sport_id = request.body.sport_id;
  // Ensure the input fields exists and are not empty
 
  if (
    clothing_id !== 0 &&
    clothing_category_id !== 0 &&
    apparent_temp_range_start !== "" &&
    apparent_temp_range_end !== ""
  ) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "UPDATE recommended SET clothing_id = ?,clothing_category_id = ?, apparent_temp_range_start = ? , apparent_temp_range_end = ?, feel_id = ?,sport_id = ? WHERE recommended_id = ? ;",
      [
        clothing_id,
        clothing_category_id,
        apparent_temp_range_start,
        apparent_temp_range_end,
        feel_id,
        sport_id,
        recommended_id,
      ],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        if (results.affectedRows > 0) {
          //console.log('password updated');
          res.status(200).send({
            message: "recommend id " + recommended_id + " is updated",
          });
        } else {
          //console.error('no user exists in db to update');
          res.status(403).send({
            message: "error updating " + recommended_id + "recommend id",
          });
        }
        res.end();
      }
    );
  } else {
    res.status(403).send({ message: "Please provide all recommend details!" });
    res.end();
  }
});
router.delete(
  "/deleteRecommend/:id",
  verifyToken,
  function (request, res, next) {
    let recommended_id = request.params.id;
    // Ensure the input fields exists and are not empty
    if (request.params.id > 0) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      connection.query(
        "DELETE FROM recommended WHERE recommended_id = ? ;",
        [recommended_id],
        function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          else {
            res.status(200).send({
              message: "recommend id " + recommended_id + " is deleted",
            });
          }
          res.end();
        }
      );
    } else {
      res.status(403).send({ message: "Please provide recommend id!" });
      res.end();
    }
  }
);
router.delete(
  "/deleteRecommendBulk",
  verifyToken,
  function (request, res, next) {
    let recommend_ids = request.body.recommend_ids;

    // Ensure the input fields exists and are not empty
    if (recommend_ids && recommend_ids.length > 0) {
      // Execute SQL query that'll select the account from the database based on the specified username and password

      connection.query(
        "DELETE FROM recommended WHERE recommended_id IN (?)",
        [recommend_ids],
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
      res.status(403).send({ message: "Please provide recommend ids!" });
      res.end();
    }
  }
);
module.exports = router;