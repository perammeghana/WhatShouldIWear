CREATE TABLE `what_should_i_wear`.`admin` (
  `admin_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `password` VARCHAR(100) NULL,
  `resetPasswordToken` VARCHAR(100) NULL,
  `resetPasswordExpires` DATETIME NULL,
  PRIMARY KEY (`admin_id`));
  

 CREATE TABLE `what_should_i_wear`.`clothing_category` (
  `clothing_category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`clothing_category_id`));
  
  
  CREATE TABLE `what_should_i_wear`.`clothing` (
  `clothing_id` INT NOT NULL AUTO_INCREMENT,
  `clothing_type` VARCHAR(40) NOT NULL,
  `clothing_image` BLOB NOT NULL,
  `clothing_category_id` INT NOT NULL,
  CONSTRAINT fk_category
    FOREIGN KEY (clothing_category_id) 
        REFERENCES clothing_category(clothing_category_id),
  PRIMARY KEY (`clothing_id`)); 
  
  
  
    CREATE TABLE `what_should_i_wear`.`preference` (
  `preference_id` INT NOT NULL AUTO_INCREMENT,
   `preference` VARCHAR(30) NOT NULL,
   `preference_category` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`preference_id`));
  
  

  
 
 
CREATE TABLE `what_should_i_wear`.`weather` (
  `weather_id` INT NOT NULL AUTO_INCREMENT,
  `location_id` INT NOT NULL,
  `Date_Time` DATETIME NOT NULL,
  `Alert` VARCHAR(100) NOT NULL,
  `Forecast` VARCHAR(100) NOT NULL,
  `Temperature` DECIMAL(4,2) NOT NULL,
  `DewPoint` DECIMAL(4,2) NOT NULL,
  `HeatIndex` DECIMAL(4,2) NULL,
  `WindChill` DECIMAL(4,2) NULL,
  `SurfaceWind` DECIMAL(4,2) NULL,
  `WindDir` VARCHAR(20) NULL,
  `Gust` DECIMAL(4,2) NULL,
  `SkyCover` DECIMAL(4,2) NULL,
  `PrecipitationPotential` DECIMAL(4,2) NOT NULL,
  `RelativeHumidity` DECIMAL(4,2) NOT NULL,
  `Rain` VARCHAR(40) NULL,
  `Thunder` VARCHAR(40) NULL,
  `Snow` VARCHAR(40) NULL,
  `FreezingRain` VARCHAR(40) NULL,
  `Sleet` VARCHAR(40) NULL,
  `ApparentTemp`  VARCHAR(100) NULL,
  PRIMARY KEY (`weather_id`)
 );


  CREATE TABLE `what_should_i_wear`.`recommended` (
  `recommended_id` INT NOT NULL AUTO_INCREMENT,
  `clothing_id` INT NOT NULL,
  `clothing_category_id` INT NOT NULL,
  `apparent_temp_range_start` INT NOT NULL,
  `apparent_temp_range_end` INT NOT NULL,
  `preference_id` INT NOT NULL,
  CONSTRAINT fk_clothingID
    FOREIGN KEY (clothing_id) 
        REFERENCES clothing(clothing_id),
  CONSTRAINT fk_preference_id
    FOREIGN KEY (preference_id) 
        REFERENCES preference(preference_id),
        PRIMARY KEY (`recommended_id`));
  
/*ENGINE = MyISAM;


INSERT INTO clothing_category (clothing_category_id, category_name)
VALUES
(1, 'T-Shirts'),
(2, 'Jeans'),
(3, 'Jackets'),
(4, 'Sweaters'),
(5, 'Dresses');


INSERT INTO clothing (clothing_id, clothing_type, clothing_image, clothing_category_id) 
VALUES (1, 'shirt', '/images/shirt1.jpg', 2),
	(2, 'pants', '/images/pants1.jpg', 1),
               (3, 'dress', '/images/dress1.jpg', 2),
              (4, 'jacket', '/images/jacket1.jpg', 1),
              (5, 'light pants', '/images/shoes1.jpg', 5);


INSERT INTO preference (preference_id,  preference,preference_category)
VALUES
(1,  'run','Sport'),
(2,  'walk','Sport'),
(3,  'casual','Sport'),
(4,  'hot','Feel'),
(5,  'cold','Feel');

INSERT INTO weather (weather_id,location_id,Date_Time, Alert, Forecast, Temperature, DewPoint, HeatIndex, WindChill, SurfaceWind, WindDir, Gust, SkyCover, PrecipitationPotential, RelativeHumidity, Rain, Thunder, Snow, FreezingRain, Sleet, ApparentTemp)
VALUES
(1, 'New York', 12345, '2023-02-27 00:00:00','19:30:00', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, '10.5', 8.2, 70.0, 0.2, 72.5,'1','2','3','4','5','6'),
(2, 'Los Angeles', 23456, '2023-02-28 00:00:00','11:30:00', 'Sunny', 20.3, 15.4, 22.1, 18.0, 8.5, '10.2', 12.1, 50.0, 0.6,'1','2','3','4','5','6'),
(3, 'Chicago', 34567,'2023-03-01 00:00:00', '09:30:00', 'Sunny', 18.2, 12.8, 20.5, 16.0, 5.6, '80.3', 6.5, 80.0, 0.3, 78,'1','2','3','4','5','6'),
(4, 'Houston', 45678, '2023-03-02 00:00:00', '08:30:00', 'Sunny', 14.7, 10.5, 16.8, 12.5, 7.2, '10.1', 9.3, 60.0, 0.4, 68.9,'1','2','3','4','5','6'),
(5, 'Philadelphia', 56789, '2023-03-03 00:00:00', '05:30:00', 'Sunny', 23.6, 18.9, 25.3, 21.0, 10.8, '20.5', 14.2, 40.0, 0.8, 55.1,'1','2','3','4','5','6');

INSERT INTO location (location_id, postal_code, city, state, latitude, longitude, isAvailable)
VALUES
(1, 12345, 'New York', 'NY', 40.71277600, -74.00597400, 1),
(2, 23456, 'Los Angeles', 'CA', 34.05223500, -118.24368300, 1),
(3, 34567, 'Chicago', 'IL', 41.87811300, -87.62979900, 1),
(4, 45678, 'Houston', 'TX', 29.76042700, -95.36980300, 1),
(5, 56789, 'Philadelphia', 'PA', 39.95258300, -75.16522200, 1);





INSERT INTO recommended (recommended_id, clothing_id, clothing_category_id, apparent_temp_range_start, apparent_temp_range_end,preference_id)
VALUES
(1, 1, 1, 0, 10,1),
(2, 2, 1, 11, 20,2),
(3, 3, 2, 0, 10,2),
(4, 4, 2, 11, 20,1),
(5, 5, 3, 0, 10,1);

INSERT INTO weather (location_id,Date_Time, Alert, Forecast, Temperature, DewPoint, HeatIndex, WindChill, SurfaceWind, WindDir, Gust, SkyCover, PrecipitationPotential, RelativeHumidity, Rain, Thunder, Snow, FreezingRain, Sleet, ApparentTemp)
VALUES
(6, DATETIME('2023-04-02 01:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 02:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 03:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 04:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 05:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 06:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 07:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 08:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 09:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 10:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 11:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 12:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 13:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 14:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 15:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 16:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 17:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 18:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 19:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 20:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 21:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 22:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-02 23:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 00:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 01:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 02:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 03:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 04:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 05:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 06:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 07:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 08:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 09:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 10:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 11:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 12:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 13:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 14:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 15:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null),
(6, DATETIME('2023-04-03 16:00:00'),'Thunder', 'Sunny', 12.5, 8.7, 15.2, 10.3, 6.7, 'NE', 8.2, 70.0, 8, 72.5,null,null,null,null,null,null);
 


/*
drop table admin;
drop table clothing;
drop table clothing_category;
drop table location;
drop table preference;
drop table recommended;
drop table weather;

*/





