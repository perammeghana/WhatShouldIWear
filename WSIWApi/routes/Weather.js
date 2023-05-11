var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const config = require('../config/dbconfig');
const moment = require('moment-timezone');

const connection = mysql.createConnection(config.db);
router.get('/getWeatherData/:id', function(req, res, next) {
    let postal_code = req.params.id;
    console.log(postal_code);
    //connection.query('SELECT DATE_FORMAT(Date_Time, "%Y-%m-%dT%H:%i:%sZ") AS formatted_time FROM weather where Date_Time between "2023-" and ?;',
    connection.query('select * from weather where location_id = ? ;',[postal_code],
     function(error, results, fields) {
        // if(results.length>0){
            res.send(results);
        //}
    });
});
router.get('/getWeatherDataHourly', function(req, res, next) {
    let postal_code = req.query.id;
    let tz=req.query.tz;
    let dateParam = req.query.date;
    let day = req.query.day;
    let start_time = "";
    let end_time = "" ;
    if(day == 'today'){
         // get the current date and time in the desired timezone
        const date = moment().tz(tz);
        // print the date in the desired timezone
        console.log(date.format()); 
        // create a moment object with the desired date and time with offset as parameter
        const dateOff = moment.tz(date.format(), tz);
        // convert to UTC
        const date_utc_start = dateOff.startOf('hour').utc();
        // print the UTC date for the start datetime
        start_time = date_utc_start.format();
        console.log(date_utc_start.format());
        // add one day and convert to UTC for the end datetime
        const date_utc_end = dateOff.clone().add(1, 'day').startOf('hour').utc();
        end_time = date_utc_end.format();
        // print the UTC date
        console.log(date_utc_end.format());
    }
    else{
        // create a moment object with the desired date and time
        const date = moment.tz(dateParam, tz);
        // print the date in the desired timezone with offset
        console.log(date.format());
        // create a moment object with the desired date and time with offset as parameter
        const dateOff = moment.tz(date.format(), tz);
        // convert to UTC
        const date_utc_start = dateOff.utc();
        // print the UTC date for the start datetime
        start_time = date_utc_start.format();
        console.log(date_utc_start.format());
        // add one day and convert to UTC for the end datetime
        const date_utc_end = dateOff.clone().add(1, 'day').utc();
        end_time = date_utc_end.format();
        // print the UTC date
        console.log(date_utc_end.format());
    }
    connection.query('select * from weather where location_id = ? and Date_Time >= ? and Date_Time < ? order by Date_Time;',[postal_code,start_time,end_time],
     function(error, results, fields) {
        if (error) throw error;
        else {
            for (let index = 0; index < results.length; index++) {
                const element = results[index].Date_Time;
                dateConverted = element.toLocaleString('en-US', {
                      timeZone: tz
                    });
                results[index].Date_Time = dateConverted;
            }
            res.send(results);
        }
    });
});
router.get('/getWeatherDataWeekly', function(req, res, next) {
    let postal_code = req.query.id;
    let tz=req.query.tz;
    let dateParam = req.query.date;
    let amData,pmData;
    // create a moment object with the desired date and time
    const date = moment.tz(dateParam, tz);
    // print the date in the desired timezone with offset
    console.log(date.format());
    // Get today's date in the specified timezone
    const todayInTimezone = moment().tz(tz);
    checkToday = date.isSame(todayInTimezone, 'day');
    console.log(date.isSame(todayInTimezone, 'day'))
    // create a moment object with the desired date and time with offset as parameter
    const dateOff = moment.tz(date.format(), tz);
    // convert to UTC
    const date_utc_start = dateOff.utc();
    // print the UTC date for the start datetime
    start_time = date_utc_start.format();
    console.log(date_utc_start.format());
    // add one day and convert to UTC for the end datetime
    const date_utc_end = dateOff.clone().add(1, 'day').utc();
    end_time = date_utc_end.format();
    // print the UTC date
    console.log(date_utc_end.format());
    if(checkToday){
        amData = start_time;
        pmData =end_time
    }
    else{
        console.log("in else")
        //In a day to get the avg of 6AM to 6PM Wind and SurfaceWind
        amData = dateOff.clone().add(6, 'hours').utc().format();
        console.log(amData);
        pmData = dateOff.clone().add(18, 'hours').utc().format();
        console.log(pmData);
    }
    connection.query('select MIN(Temperature) AS min_temp, MAX(Temperature) AS max_temp, ROUND(AVG(CASE WHEN Date_Time BETWEEN ? AND ? THEN SurfaceWind END)) AS avg_SurfaceWind,AVG(CASE WHEN Date_Time BETWEEN ? AND ? THEN SkyCover END) AS avg_SkyCover from weather where location_id = ? and Date_Time >= ? and Date_Time < ?;',[amData,pmData,amData,pmData,postal_code,start_time,end_time],
     function(error, results, fields) {
        if (error) throw error;
        else {
            for (let index = 0; index < results.length; index++) {
                    const element = results[index].avg_SkyCover;
                    if(element<=30){
                        results[index].forecast = 'Clear Sky';
                    }
                    else if(element > 30 && element < 70){
                        results[index].forecast = 'Partly Cloudy';
                    }
                    else if(element >= 70){
                        results[index].forecast = 'Mostly Cloudy';
                    }
                }
            res.send(results);
        }
    });
});
module.exports = router;



