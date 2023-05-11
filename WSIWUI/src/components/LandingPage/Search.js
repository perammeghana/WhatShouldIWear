import React, { useEffect, useState } from 'react'
import { Center, Grid, GridItem } from '@chakra-ui/react'
import { Text, Box, Image } from '@chakra-ui/react'
import Settings from './Setting';
import './Search.css'
import axios from "axios";
import Test from './Test';
import moment from 'moment-timezone';
import Cookie from 'js-cookie';
import {Circles} from "react-loader-spinner";
import { Link } from "@chakra-ui/react";

const Search = ({props,setStyle,set_pref,set_timezone,set_hourly_info,set_weekly_data,
    cityData,cityParent, defaultPrefIndex,setDivContent,divContent,latlong,
    setSelectedHourlyButton,setSelectedWeeklyButton,set_time_selected,style,postal_code,postalCodeData,set_timezone_abbr,isLocationEnable, setImageSrc,
    set_location_id,pref,dataHourlyInSearch,dsearch,set_recommend_info,setPreviousData, previousData,setlatslongs, pref_id, set_pref_id, imageSrc}) => {
    let timeZoneId='';
    const nextDates = [];
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const today = new Date();
        
    // const [valueFromChild, setValueFromChild] = useState({
    //     postalCaode: "",
    //     latitude: "",
    //     longitude: "",
    //     city: "",
    //     state: "",
    //     country: "",
    //     tz:"",
    //     IsAvailable: false,
    //   });
  // Callback function to receive value from child component
    useEffect(()=>{
        const imageName = Cookie.get('Preference');
        if (imageName) {
            try {
                const imageUrl = require(`./ImagesForProj/${imageName}.png`);
                setImageSrc(imageUrl);
            } catch (error) {
                setImageSrc('');
            }
        
        }
    })
    const handleValueFromChild = (value) => {
        // setValueFromChild(value);
        setIsLoadingSearch(true)
        checkifDataExists(value);
    };
    const checkifDataExists=async(valuedData)=>{
        console.log(valuedData)
        try {
            let res = []
            //console.log(valuedData.city)
            if(valuedData.postalCaode==="")
                res = await axios.get("https://api.mikebelus.net/locationAPI/checkLocation?city="+valuedData.city);
            else
                res = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+valuedData.postalCaode);
            if(res.data.message == "city does not exist"){
                set_location_id(0)
                setlatslongs({
                    latitude:'',
                    longitude:''
                })
                postalCodeData("");
                //await getGoogleTimeZone(valuedData.latitude,valuedData.longitude);
                // await getHourlyData(0);
                // await getWeeklyData(0);
                set_hourly_info([]);
                set_weekly_data([]);
                await addnewLocation(valuedData)                  
            }
            else{
                set_location_id(res.data.location_id)
                cityParent(res.data.city)
                setlatslongs({
                    latitude:res.data.latitude,
                    longitude:res.data.longitude
                })
                postalCodeData(res.data.postal_code);
                //highlight first button on selecting a location
                setSelectedHourlyButton(1)
                setSelectedWeeklyButton(1)
                Cookie.set("Last_location", res.data.city);	
                Cookie.set("Last_postalcode", res.data.postal_code);	
                setPreviousData(true);
                await getGoogleTimeZone(res.data.latitude,res.data.longitude);
                await getHourlyData(res.data.location_id,res.data);
                await getWeeklyData(res.data.location_id);
                await getalerts(res.data.latitude,res.data.longitude);
                //await getrecommends(dsearch.ApparentTemp,pref.pref_id,style.feel_id)
                    
            }
            }
          catch (err) {
            console.log(err)
            setIsLoadingSearch(false)
          }
    }
    const getHourlyData= async(locid,resdata)=>{
        console.log("in hourly")
        set_hourly_info([]);
        if(locid!=0){
            try {
            let res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataHourly?id="+locid+"&tz="+timeZoneId+"&date=2023-04-10&day=today");
            //console.log(res.data)
            if(res.data.length > 0){
                console.log("inide if")
                dataHourlyInSearch({
                    Temperature : res.data[0].Temperature,
                    Forecast : res.data[0].Forecast,
                    ApparentTemp : res.data[0].ApparentTemp,
                    PrecipitationPotential : res.data[0].PrecipitationPotential,
                    wind : res.data[0].SurfaceWind,
                    windDire : res.data[0].WindDir
                })
                set_hourly_info(res.data);
                //get the first hour data in the banner
                let dateNow = res.data[0].Date_Time !== null && res.data[0].Date_Time.split(",");
                const dateLet = new Date(dateNow);
                    const givenHour = dateLet.toLocaleString('en-US', {
                    hour: 'numeric',
                    hour12: true
                    });
                    const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
                    set_time_selected(formattedTime)
                    if(pref_id === null || pref_id === undefined){
                        set_pref_id(Cookie.get("Preference_id"));
                    }
                    await getrecommends(res.data[0].ApparentTemp,Cookie.get("Preference_id"),Cookie.get("feel_id"))
            }
            else{
                let hourlyresp;
                hourlyresp = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+locid);
                    console.log(hourlyresp.data)
                    if(hourlyresp.data == "Python script exited with code 0"){
                        dataHourlyInSearch.city =resdata.city;
                        dataHourlyInSearch.state =resdata.state;
                        dataHourlyInSearch.country =resdata.country;
                        dataHourlyInSearch.latitude =resdata.latitude;
                        dataHourlyInSearch.longitude =resdata.longitude;
                        dataHourlyInSearch.tz ='';
                        dataHourlyInSearch.postalCaode =resdata.postal_code;
                        await getHourlyData(locid,resdata)
                    }
                  // set_hourly_info([]);
                  // dataHourlyInSearch([]);
              }
            } catch (err) {
            console.log(err)
            }
        }
        else{
            set_hourly_info([]);
            dataHourlyInSearch([]);
        }
      }
    const getWeeklyData = async(locid) => {
        set_weekly_data([]);
        if(locid != 0){
            let finalResult = []
            //let timezone = 'America/New_York';
            const currentDate = moment().tz(timeZoneId); // Replace "Your_Timezone" with the desired timezone
        
          // Loop to get the next 6 dates
          for (let i = 0; i <= 5; i++) {
            // Add i days to the current date to get the next date
            const nextDate = moment(currentDate).add(i, "days");
        
            // Format the next date in "mm-dd-yyyy" format
            const formattedDate = nextDate.format("YYYY-MM-DD");
            
            let dayOfWeek;
            // Get the day of the week for the next date
            if (nextDate.isSame(today, 'day')) {
                dayOfWeek = "Today";
            } else {
                dayOfWeek = nextDate.format("dddd");
            }
            // Get the day of the week for the next date
            // const dayOfWeek = nextDate.format("dddd");
        
            // Push the formatted date and day of the week to the nextDates array
            nextDates.push({ date: formattedDate, day: dayOfWeek });
            try {
              let res = [];
              res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataWeekly?id="+locid+"&tz="+timeZoneId+"&date="+formattedDate);
              //set_weekly_data(res.data);
              if(res.data.length > 0){
                res.data[0].date = formattedDate
                res.data[0].day = dayOfWeek
                finalResult.push(res.data)
              }
              //set_weekly_data((prevArray) => [...prevArray, res.data]);
            } catch (err) {
            console.log(err)
            }
            }
            set_weekly_data(finalResult)
            setIsLoadingSearch(false)
        };
    }
    const getGoogleTimeZone = async (latitude, longitude, apiKey) => {
    try {
        apiKey='';
        const response = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=${apiKey}`
        );
        timeZoneId = response.data.timeZoneId;
        const abbrTZ = moment.tz(timeZoneId).format('z');
        set_timezone_abbr(abbrTZ)
        set_timezone(timeZoneId)
        // Handle timezone data as needed
        //console.log('Timezone ID:', timeZoneId);
    } catch (error) {
        console.error('Error getting timezone:', error);
    }
    };
    const getrecommends = async(appTemp,prefid,feelid) => {
        set_recommend_info([]);
        try {
            let resDat = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
            console.log(resDat.data)
            set_recommend_info(resDat.data);
        } catch (err) {
            console.log(err)
        }
    }
    const getalerts = async(lats,longs)=>{
        const response = await fetch("https://forecast.weather.gov/showsigwx.php?warnzone=NYZ010&warncounty=NYC029&firewxzone=NYZ010&local_place1=2%20Miles%20ESE%20Kenmore%20NY&product1=Hazardous+Weather+Outlook&lat="+lats+"&lon="+longs+"#.Xzk52RkpBuQ"); // replace with your desired URL
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainDiv = doc.querySelector('#mainnonav670');
        const innerDiv = mainDiv.querySelector('div');
        const h3 = innerDiv.querySelector('h3');
        const h3text = h3 ? h3.innerHTML : 'No h3 found';
        if(h3text.includes("No Active Hazardous Weather Conditions")){
          setDivContent('')
        }
        else{
          setDivContent(h3text)
        }
    }
    const addnewLocation=async(data)=>{
        try {
            console.log("add loc")
            let dataHourlyInfo =[];
            //if postal code is not entered then get only one postal code data for that location
            if(data.postalCaode == ""){
                if(data.country !== '' && data.state !== '' && data.city !== ''){
                    fetch(`https://community-zippopotamus.p.rapidapi.com/${data.country}/${data.state}/${data.city}`, {
                        method: 'GET',
                        headers: {
                        'X-RapidAPI-Key': '9c04a9f33emshe7e6073d64b000fp13bc0fjsn009b1b772cff',
                        'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
                        },
                    })
                        .then(response => response.json())
                        //.then(response =>  console.log(response?.places[0]))
                        .then(response =>  {
                        const dataByPostalCode = {
                            postal_code: response?.places[0]['post code'],
                            latitude: response?.places[0].latitude, 
                            longitude: response?.places[0].longitude,
                            city: response?.places[0]['place name'],
                            state: data.state,
                            isAvailable: 'Yes',
                        }
                        //console.log(response?.places)
                        fetch("https://api.mikebelus.net/locationAPI/addLocation", {
                            method: "POST",
                            body: JSON.stringify(dataByPostalCode),
                            headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            "x-access-token": localStorage.getItem("jwtToken"),
                            },
                        })
                        .then(response => response.json())
                        .then(async(response) => {
                            console.log(response.message)
                            let res2,res3;
                            if(response.message == "location(s) created"){
                            res2 = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+dataByPostalCode.postal_code);
                            if(res2.data.message == "city does not exist"){   
                            }
                            else{
                                res3 = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+res2.data.location_id);
                                if(res3.data == "Python script exited with code 0"){
                                dataHourlyInfo.city =res2.data.city;
                                dataHourlyInfo.state =res2.data.state;
                                dataHourlyInfo.country =res2.data.country;
                                dataHourlyInfo.latitude =res2.data.latitude;
                                dataHourlyInfo.longitude =res2.data.longitude;
                                dataHourlyInfo.tz ='';
                                dataHourlyInfo.postalCaode =res2.data.postal_code;
                                await checkifDataExists(dataHourlyInfo)
                                }
                            }
                            }
                        })
                        })
                        .catch(err => console.error(err));
                }
                else{
                    setIsLoadingSearch(false)
                }
            }
            else{
                //if location doesn't exist in location table add the new pin code and get 24hrs data
                let resDisabled = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostalDisabled?postal="+data.postalCaode);
                if(resDisabled.data.message == "city does not exist"){
                    fetch(`https://community-zippopotamus.p.rapidapi.com/us/${data.postalCaode}`, {
                        method: 'GET',
                        headers: {
                        'X-RapidAPI-Key': '9c04a9f33emshe7e6073d64b000fp13bc0fjsn009b1b772cff',
                        'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
                        },
                    })
                    .then(response => response.json())
                    .then(response =>  {
                    const dataByPostalCode = {
                        postal_code: response['post code'],
                        latitude: response?.places[0].latitude, 
                        longitude: response?.places[0].longitude,
                        city: response?.places[0]['place name'],
                        state: response?.places[0]['state abbreviation'],
                        isAvailable: 'Yes',
                    }
                    //console.log(response?.places)
                    fetch("https://api.mikebelus.net/locationAPI/addLocation", {
                        method: "POST",
                        body: JSON.stringify(dataByPostalCode),
                        headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "x-access-token": localStorage.getItem("jwtToken"),
                        },
                    })
                    .then(response => response.json())
                    .then(async(response) => {
                        console.log(response.message)
                        let res2,res3;
                        if(response.message == "location(s) created"){
                        res2 = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+dataByPostalCode.postal_code);
                        if(res2.data.message == "city does not exist"){   
                        }
                        else{
                            res3 = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+res2.data.location_id);
                            if(res3.data == "Python script exited with code 0"){
                            dataHourlyInfo.city =res2.data.city;
                            dataHourlyInfo.state =res2.data.state;
                            dataHourlyInfo.country =res2.data.country;
                            dataHourlyInfo.latitude =res2.data.latitude;
                            dataHourlyInfo.longitude =res2.data.longitude;
                            dataHourlyInfo.tz ='';
                            dataHourlyInfo.postalCaode =res2.data.postal_code;
                            await checkifDataExists(dataHourlyInfo)
                            }
                        }
                        }
                    })
                    })
                    .catch(err => console.error(err));
                    
                }
                //check if location's IsAvailable is No then update isAvailable as "Yes"
                else{
                await fetch("https://api.mikebelus.net/locationAPI/editLocation", {
                method: "PUT",
                body: JSON.stringify({
                    location_id: resDisabled.data.location_id,
                    isAvailable: 'Yes',
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "x-access-token": localStorage.getItem("jwtToken"),
                },
                })
                //.then(response => response.json())
                .then(async(response) => {
                let newresponse;
                console.log("edit loc")
                if(response.ok){
                    newresponse = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+resDisabled.data.location_id);
                    if(newresponse.data == "Python script exited with code 0"){
                        dataHourlyInfo.city =resDisabled.data.city;
                        dataHourlyInfo.state =resDisabled.data.state;
                        dataHourlyInfo.country =resDisabled.data.country;
                        dataHourlyInfo.latitude =resDisabled.data.latitude;
                        dataHourlyInfo.longitude =resDisabled.data.longitude;
                        dataHourlyInfo.tz ='';
                        dataHourlyInfo.postalCaode =resDisabled.data.postal_code;
                        await checkifDataExists(dataHourlyInfo)
                    }
                }
                });
                }
            }
        } catch (err) {
        console.log(err)
        }
        }
    return (
        // <div className='searchdiv' onLoad={defaultCity}>
        <div className='searchdiv'>
            {isLoadingSearch  &&
                <div>
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 9998,
                }}></div>
                <Circles
                    height="80"
                    width="80"
                    color="black"
                    ariaLabel="circles-loading"
                    wrapperStyle={{
                    position: "absolute",
                    top: "42%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    }}
                    wrapperClass=""
                    visible={true}
                />
                <p style={{
                    position: "absolute",
                    top: "48%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    fontFamily:'Karma',
                    fontSize:"22px",
                    fontWeight:"bold"
                }}>Please wait while we get your recommendations</p>
                </div>
                }
            <Settings setImageSrc={setImageSrc} position="absolute" top="0" right="0" style={style} setStyle={setStyle} pref={pref} defaultPrefIndex={defaultPrefIndex}
            set_pref={set_pref} set_recommend_info={set_recommend_info} dsearch={dsearch} pref_id={pref_id} set_pref_id={set_pref_id}/>
            <Test setPreviousData = {setPreviousData} set_recommend_info={set_recommend_info} onValueChange={handleValueFromChild}></Test>	
            {postal_code!=='' &&	
                <Text textAlign={"center"} fontSize="3xl" color={"white"} mt={"1vh"} fontFamily={"Karma"} fontWeight={"bold"} >{cityData}({postal_code})</Text>	
            }	
            {	
                !previousData && !isLocationEnable ?	
                    <Text textAlign={"center"} fontSize="3xl" color={"white"} mt={"1vh"} fontFamily={"Karma"} > Please select any location to get clothing recommendations</Text>	
                :	
                postal_code==='' &&	
                <Text textAlign={"center"} fontSize="3xl" color={"white"} mt={"1vh"} fontFamily={"Karma"} >Please wait while we get your location details !</Text>	
            }   
            {(dsearch.Temperature !== undefined && dsearch.Temperature !== "") &&
            <Grid templateColumns='repeat(2, 1fr)' display={'flex'} flexWrap="wrap" justifyContent={'space-around'}>	
                <GridItem>	
                    <Box p={4} >	
                        <Box	
                            px={3}	
                            py={2}	
                            color="white"	
                            // mb={2}	
                            className="text_bkg_box"	
                        >
                            <div className='startcontimg'>	
                                <Image  className='w-d-img' src={require('./ImagesForProj/temp_main.png')} alt='op'/>	
                                <Text  className='w-d-text' fontFamily={"Karma"} textAlign="right" padding="0px" flexShrink={"0"}>	
                                    {/* {(props.send_search.temperature !== '15' && props.send_search.temperature) || (weather_data && weather_data.temperature) || (18)} ° F */}	
                                    {/* {props.set_hourly_info[0].Temperature}° F */}	
                                    &nbsp;{dsearch.Temperature}° F 	
                                </Text>	
                            </div>
                         
                            <p className='textSearch'>Temperature</p>	
                            
                        </Box>	
                    </Box>	
                </GridItem>	
                <GridItem>	
                    <Box p={4}>	
                        <Box 	
                            px="2vw"	
                            py="1vw"	
                            color="white"	
                            // mb={2}	
                            className="text_bkg_box"	
                        >	
                            <div className='startcontimg'>	
                                <Image className='w-d-img' src={require(`./SearchImages/${dsearch.Forecast}.png`)} alt='op'/>	
                                <Text className='w-d-text' fontFamily={"Karma"} textAlign="center" padding="0px" flexShrink={"0"}>	
                                    {/* {(props.send_search.discription !== "Cloudy" && props.send_search.discription) || (weather_data && weather_data.discription)	
                                        || ("Sunny")	
                                    }<p className='textSearch'>Forecast</p> */}	
                                    &nbsp;{dsearch.Forecast} 	
                                </Text>	
                            </div>	
                            <p className='textSearch'>Forecast</p>
                            	
                        </Box>	
                    </Box>	
                </GridItem>	
                <GridItem>	
                    <Box p={4}>	
                        <Box	
                            px={3}	
                            py={2}	
                            color="white"	
                            // mb={2}	
                            className="text_bkg_box"	
                        >	
                            <div className='startcontimg'>	
                                <Image  className='w-d-img' src={require('./ImagesForProj/wind_main.png')} alt='op' />	
                                <Text className='w-d-text' fontFamily={"Karma"} textAlign="right" padding="0px">	
                                    &nbsp;{dsearch.wind} mph {dsearch.windDire}	
                                    {/* {(props.send_search.surface_wind != "10" && props.send_search.surface_wind) || (weather_data && weather_data.surface_wind) || (10)}	
                                    mph {(props.send_search.wind_direction !== "WS" && props.send_search.wind_direction) || (weather_data && weather_data.wind_direction) || ("NW")} */}	
                                </Text>	
                            </div>	
                            <p className='textSearch'>Wind Speed</p>	
                        </Box>	
                    </Box>	
                </GridItem>	
                <GridItem>	
                    <Box p={4}>	
                        <Box	
                            px={3}	
                            py={2}	
                            color="white"	
                            // mb={2}	
                            className="text_bkg_box"	
                        >	
                            <div className='startcontimg'>	
                                <Image  className='w-d-img'   src={require('./ImagesForProj/feelslike_main.png')} alt='op'/>	
                                <Text  className='w-d-text' fontFamily={"Karma"} textAlign="right" padding="0px">	
                                &nbsp;{dsearch.ApparentTemp}° F	
                                    {/* {(props.send_search.feels_like !== "15" && props.send_search.feels_like) || (weather_data && weather_data.feels_like) || (!weather_data && 13)}° F */}	
                                </Text>	
                            </div>	
                            <p className='textSearch'>Feels Like</p>	
                        </Box>	
                    </Box>	
                </GridItem>
                <GridItem>		
                    <Box p={4}>		
                        <Box		
                            px={3}		
                            py={2}		
                            color="white"		
                            //mb={2}		
                            className="text_bkg_box"		
                        >			
                            <div className='startcontimg'>
                            	
                                <Image  className='w-d-img'   src={imageSrc} alt={""}/>
                                <Text marginLeft='5px' className='w-d-text' fontFamily={"Karma"} textAlign="right" padding="0px">	
                               {Cookie.get("Preference")}</Text>
                            </div>		
                            <p className='textSearch'>Preference</p>	
                        </Box>		
                    </Box>		
                </GridItem>
            </Grid>
            }
            
            {divContent!=='' &&
            <Grid templateColumns='repeat(2, 1fr)' display={'flex'} flexWrap="wrap" justifyContent={'space-around'}>	
                <GridItem>
                <Box  p={4}>		
                <Box 		
                    px={3}		
                    py={2}		
                    color="white"		
                    //mb={2}		
                    className="text_bkg_box_b"		
                >	
                <Link href={"https://forecast.weather.gov/showsigwx.php?warnzone=NYZ010&warncounty=NYC029&firewxzone=NYZ010&local_place1=2%20Miles%20ESE%20Kenmore%20NY&product1=Hazardous+Weather+Outlook&lat="+latlong.latitude+"&lon="+latlong.longitude+"#.Xzk52RkpBuQ"} textDecoration={"underline"} fontFamily={"Karma"} 
                fontWeight="bold" fontSize="xl" color="red.500" isExternal>Alert : {divContent}</Link>
                </Box>
                </Box>
                </GridItem>
            </Grid>
            }
        </div>
    )
}

export default Search