import CaptionCarousel from './CaptionCarousel';
import './LandingPage.css';
import Search from './Search';
import Info1 from './Info1';
import TimeContainer from './TimeContainer';
import ImageFooter from './ImageFooter';
import { useState, useEffect } from "react";
import { ChakraProvider } from '@chakra-ui/react';
import axios from "axios";
import mydata from './data';
import moment from 'moment-timezone';
import Cookie from 'js-cookie';
import {Circles} from "react-loader-spinner";

function LandingPage() {
  const [day, setDay] = useState("Today");
  //const [pref, set_pref] = useState("Casual");
  const [pref, set_pref] = useState();
  const [pref_id, set_pref_id] = useState();
  const [defaultPrefIndex, setDefaultPrefIndex] = useState();
  const [style, setStyle] = useState({
    feel:"Normal",
    feel_id:5
  });
  const [latlong, setlatslongs] = useState({
    latitude:'',
    longitude:''
  });
  let timeZoneId='';
  const [isLoading, setIsLoading] = useState(false);
  // const [weather_data, set_weather_data] = useState(null);
  //const [clothes_data, set_clothes_data] = useState(null);
  // const [act_data, set_act_data] = useState(mydata);
  // const [searchip, setSearchip] = useState(0);
  const today = new Date();
  // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [hourlyInfo,set_hourly_info] = useState([]);
  const [weekly_data, set_weekly_data] = useState([]);
  const [recommend_data, set_recommend_info] = useState([]);
  const [timezone_id, set_timezone] = useState("");
  const [timezone_id_abbr, set_timezone_abbr] = useState("");
  const [loc_id, set_location_id] = useState("");
  const [recommDay, set_recomm_day] = useState("Today");
  const [timeSelected, set_time_selected] = useState("");
  const [selectedHourlyButton, setSelectedHourlyButton] = useState(1);
  const [selectedWeeklyButton, setSelectedWeeklyButton] = useState(1);
  const [postal_code,postalCodeData]=useState("");
  const [cityData,cityParent]=useState("");
  const [divContent, setDivContent] = useState('');
  const [dsearch,dataHourlyInSearch] = useState({
    Temperature : "",
    Alert:"",
    Forecast:"",
    ApparentTemp:"",
    PrecipitationPotential : "",
    wind:"",
    windDire:""
});
let dataHourlyInfo = [];
const [locationHandled, setLocationHandled] = useState(false);
const [isLocationEnable, setIsLocationEnable] = useState(false);
const [previousData, setPreviousData] = useState(false);
const [imageSrc, setImageSrc] = useState('');	
useEffect(() => {	
    const imageName = Cookie.get('Preference');	
    if (imageName) {	
        try {	
            const imageUrl = require(`./ImagesForProj/${imageName}.png`);	
            setImageSrc(imageUrl);	
        } catch (error) {	
            setImageSrc('');	
        }	
    	
    }	
}, []);
  // let curr_day_idx = today.getDay();
  // let apparentTemperature = 0;
  // const [locationVals, location_Data] = useState({
  //   location_id:'',
  //   postal_code :'',
  //   city:'',
  //   state:'',
  //   latitude:'',
  //   longitude:'',
  //   isAvailable : ''
  // });
  // const day_list = []
  //   // Create an array to store the next 6 dates
   const nextDates = [];
  // day_list.push(weekday[curr_day_idx])
  // let temp1 = (curr_day_idx + 1) % 7;

  // while (temp1 !== curr_day_idx) {
  //   day_list.push(weekday[temp1]);
  //   temp1 = (temp1 + 1) % 7;
  // }

  // localStorage.setItem("searchip", 0);

  // useEffect(() => {
  //   window.addEventListener('storage', () => {
  //     setDay(localStorage.getItem("day"));
  //     set_recomm_day(localStorage.getItem("day"))
  //     //setStyle(localStorage.getItem("style"));
  //     setSearchip(localStorage.getItem("searchip"));
  //     //set_pref({localStorage.getItem("pref"))
  //   })
  // }, [searchip]);


  // useEffect(() => {
  //   get_data_for_info1();
  // }, [searchip]);

  // useEffect(() => {
  //   send_info_search();
  // }, [day]);
  async function getpreferences() {
    try {
        let res = await axios.get("https://api.mikebelus.net/prefAPI/getPreferenceSport");
        
        res.data.map((item, index)=>{
            if(item.preference_id == Cookie.get("Preference_id")){
                setDefaultPrefIndex(index)
            }
        })

    } catch (err) {
        console.log(err)
    }
  }
  useEffect(()=>{
    defaultCity();
    getpreferences();
  },[])

  // async function get_data_for_info1(event) {
  //   try {
  //     let res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherData/" + searchip);
  //     set_weather_data(res.data);
  //     res.data.sort(function (a, b) {
  //       return day_list.indexOf(a.day) - day_list.indexOf(b.day);
  //     });
  //     set_act_data(res.data);
  //     if (res.data.length === 0) {
  //       set_act_data(mydata)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // };

  // window.addEventListener('storage', get_data_for_info1);
  // const curr_hour = today.getHours();
  // const time_list = [];
  // const curr_str = curr_hour.toString();
  // if (curr_str.length === 1) {
  //   time_list.push('0' + curr_str)
  // }
  // else
  //   time_list.push(curr_str);
  // let temp = (curr_hour + 1) % 24;
  // while (temp !== curr_hour) {
  //   var tempstr = temp.toString();
  //   if (tempstr.length === 1) {
  //     tempstr = '0' + tempstr
  //   }
  //   time_list.push(tempstr);
  //   temp = (temp + 1) % 24;
  // }
const defaultCity = () => {
    if (navigator.geolocation) 
    {
      let lat, long;
      async function getCity() {
          try {
              const url = "https://api.mikebelus.net/locationAPI/defaultCity/" + lat + "/" + long;
              let res = await axios.get(url);
              dataHourlyInfo.city =res.data.city;
              dataHourlyInfo.state =res.data.state;
              dataHourlyInfo.country =res.data.country;
              dataHourlyInfo.latitude =lat;
              dataHourlyInfo.longitude =long;
              dataHourlyInfo.tz =long;
              dataHourlyInfo.postalCaode =res.data.postal_code;
              checkifDataExists(dataHourlyInfo);
              Cookie.set("Last_location", res.data.city);	
              Cookie.set("Last_postalcode", res.data.postal_code);	
              setPreviousData(true);
          } catch (err) {
          console.log(err)
          }
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        setIsLocationEnable(true);
        setIsLoading(true);
          lat = position.coords.latitude;
          long = position.coords.longitude;
          setlatslongs({
            latitude : lat,
            longitude : long,
          })
          Cookie.set("latitude", lat);	
          Cookie.set("longitude", long);
          getCity();
          //setIsLocationEnabled(true);
          //console.log(dataContent)
          setLocationHandled(true);
      }, ()=>{
        let city_name = Cookie.get("Last_location") !== null ?  Cookie.get("Last_location") : "";
        let pincode = Cookie.get("Last_postalcode") !== null ?  Cookie.get("Last_postalcode") : "";
        let data = {city: city_name, postalCaode: pincode};
        setIsLocationEnable(false);
        checkifDataExists(data);
        setLocationHandled(true);
      })
    }
    if(!isLocationEnable)
    {
      dataHourlyInfo.city ="";
      dataHourlyInfo.state ="";
      dataHourlyInfo.country ="";
      dataHourlyInfo.latitude ="";
      dataHourlyInfo.longitude ="";
      dataHourlyInfo.tz ="";
      dataHourlyInfo.postalCaode ="";
      set_hourly_info([]);
      set_weekly_data([]);
    }
};
const checkifDataExists=async(valuedData)=>{
  try {
      let res = []
      //console.log(valuedData.city)
      if(valuedData.postalCaode===""){
          res = await axios.get("https://api.mikebelus.net/locationAPI/checkLocation?city="+valuedData.city);
      }
      else{
        res = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+valuedData.postalCaode);
      }
      if(res.data.message == "city does not exist"){
          set_location_id(0)
          postalCodeData("");
          setPreviousData(false);
          set_hourly_info([]);
          set_weekly_data([]);
          await addnewLocation(valuedData)             
      }
      else{
          setPreviousData(true);
          set_location_id(res.data.location_id)
          cityParent(res.data.city)
          postalCodeData(res.data.postal_code);
          Cookie.set("Last_location", res.data.city);	
          Cookie.set("Last_postalcode", res.data.postal_code);
          setSelectedHourlyButton(1)
          setSelectedWeeklyButton(1)
          await getGoogleTimeZone(res.data.latitude,res.data.longitude);
          await getHourlyData(res.data.location_id,res.data);
          await getWeeklyData(res.data.location_id);  
          await getalerts(res.data.latitude,res.data.longitude)           
      }
      }
    catch (err) {
      console.log(err)
    }
}
const addnewLocation=async(data)=>{
  try {
    console.log("add loc")  
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
          .then(async(response) =>   {
            const dataByPostalCode = {
              postal_code: response['post code'],
              latitude: response?.places[0].latitude, 
              longitude: response?.places[0].longitude,
              city: response?.places[0]['place name'],
              state: response?.places[0]['state abbreviation'],
              isAvailable: 'Yes',
            }
            let checkAgain = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+data.postalCaode);
            console.log(checkAgain.data.message)
            if(checkAgain.data.message == "city does not exist"){
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
                console.log(dataByPostalCode.postal_code)
                res2 = await axios.get("https://api.mikebelus.net/locationAPI/checkLocationPostal?postal="+dataByPostalCode.postal_code);
                if(res2.data.message == "city does not exist"){   
                }
                else{
                  res3 = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+res2.data.location_id);
                  console.log(res3.data)
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
          }
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
        console.log(response.ok)
        if(response.ok){
            newresponse = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+resDisabled.data.location_id);
            console.log(newresponse.data)
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
  } catch (err) {
  console.log(err)
  }
}
const getHourlyData= async(locid,resdata)=>{
  set_hourly_info([]);
  if(locid!=0){
      try {
      let res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataHourly?id="+locid+"&tz="+timeZoneId+"&date=2023-04-10&day=today");
      //console.log(res.data)
      if(res.data.length > 0){
          dataHourlyInSearch({
              Temperature : res.data[0].Temperature,
              Forecast : res.data[0].Forecast,
              ApparentTemp : res.data[0].ApparentTemp,
              PrecipitationPotential : res.data[0].PrecipitationPotential,
              wind : res.data[0].SurfaceWind,
              windDire : res.data[0].WindDir
          })
          set_hourly_info(res.data);
          if(pref_id == null)
          set_pref_id(Cookie.get("Preference_id"));
          
          getrecommends(res.data[0].ApparentTemp,Cookie.get("Preference_id"),Cookie.get("feel_id"))
          //get the first hour data in the banner
          let dateNow = res.data[0].Date_Time !== null && res.data[0].Date_Time.split(",");
          const dateLet = new Date(dateNow);
              const givenHour = dateLet.toLocaleString('en-US', {
              hour: 'numeric',
              hour12: true
              });
              const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
              set_time_selected(formattedTime)
      }
      else{
        let hourlyresp;
        hourlyresp = await axios.get("https://api.mikebelus.net/locationAPI/addNewData/"+locid);
            console.log(hourlyresp.data)
            if(hourlyresp.data == "Python script exited with code 0"){
              dataHourlyInfo.city =resdata.city;
              dataHourlyInfo.state =resdata.state;
              dataHourlyInfo.country =resdata.country;
              dataHourlyInfo.latitude =resdata.latitude;
              dataHourlyInfo.longitude =resdata.longitude;
              dataHourlyInfo.tz ='';
              dataHourlyInfo.postalCaode =resdata.postal_code;
              console.log(dataHourlyInfo)
              await getHourlyData(locid,resdata)
            }
          // set_hourly_info([]);
          // dataHourlyInSearch([]);
      }
      } catch (err) {
      console.log(err)
      }
  }
}
const getWeeklyData = async(locid) => {
  set_weekly_data([]);
  setIsLoading(false);
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
      //const dayOfWeek = nextDate.format("dddd");
  
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
      let res = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
      console.log("recommend")
      console.log(res.data)
      set_recommend_info(res.data);
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
  const updateCount = (newCount) => {
    set_recomm_day(newCount);
  };
  return (
    <ChakraProvider>
      {isLoading  &&
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
          {/* <p style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            fontFamily:'Karma',
            fontSize:"22px",
            fontWeight:"bold"
          }}>Please wait while we get your recommendations</p> */}
          </div>
        }
        {
          <div className='Landing'>
            <Search day={day} style={style} setStyle={setStyle} set_pref={set_pref} pref={pref} pref_id={pref_id} set_pref_id={set_pref_id}
            selectedHourlyButton={selectedHourlyButton} set_time_selected={set_time_selected} 
            isLocationEnable={isLocationEnable} setlatslongs={setlatslongs}
            postalCodeData = {postalCodeData} cityData={cityData} latlong={latlong}
            postal_code = {postal_code} cityParent={cityParent} set_timezone_abbr={set_timezone_abbr}
            set_recommend_info={set_recommend_info} set_timezone={set_timezone} dsearch={dsearch} 
            setSelectedHourlyButton={setSelectedHourlyButton} setPreviousData = {setPreviousData}
            setSelectedWeeklyButton = {setSelectedWeeklyButton}
            set_weekly_data={set_weekly_data} set_hourly_info={set_hourly_info} set_location_id={set_location_id} 
            dataHourlyInSearch={dataHourlyInSearch} divContent={divContent} setDivContent={setDivContent}
            previousData = {previousData} imageSrc={imageSrc} setImageSrc={setImageSrc} defaultPrefIndex={defaultPrefIndex}/>

            {(locationHandled && typeof(Cookie.get("latitude")) !== 'undefined') &&
            <>
              <CaptionCarousel set_time_selected={set_time_selected} 
              day={day} 
              style={style} 
              setDay={setDay} 
              pref={pref}
              set_pref={set_pref} 
              pref_id={pref_id}
              set_pref_id={set_pref_id} 
              loc_id={loc_id} 
              dataHourlyInSearch={dataHourlyInSearch} 
              set_recommend_info = {set_recommend_info}
              timezone_id={timezone_id} 
              timezone_id_abbr = {timezone_id_abbr}
              setSelectedHourlyButton={setSelectedHourlyButton}
              setSelectedWeeklyButton = {setSelectedWeeklyButton}
              timeSelected = {timeSelected} 
              dsearch={dsearch}
              recommDay = {recommDay} 
              set_recomm_day={set_recomm_day} 
              recommend_data={recommend_data} 
              set_hourly_info={set_hourly_info}/>

              <TimeContainer set_time_selected={set_time_selected} 
              dataHourlyInSearch={dataHourlyInSearch} 
              setSelectedHourlyButton = {setSelectedHourlyButton}
              pref={pref} style={style}
              hourlyInfo={hourlyInfo}  pref_id={pref_id}
              set_pref_id={set_pref_id} 
              set_recommend_info={set_recommend_info} 
              selectedHourlyButton={selectedHourlyButton} 
              setIsLocationEnable = {setIsLocationEnable}/>

              <Info1 
              setDay={setDay} 
              recommDay = {recommDay} 
              updateCount={updateCount} 
              loc_id={loc_id} pref_id={pref_id}
              set_pref_id={set_pref_id} 
              set_time_selected={set_time_selected} 
              setSelectedWeeklyButton = {setSelectedWeeklyButton}
              setSelectedHourlyButton={setSelectedHourlyButton} 
              selectedWeeklyButton = {selectedWeeklyButton}
              pref={pref}
              style={style}
              //day_list={day_list} 
              set_hourly_info={set_hourly_info} 
              weekly_data={weekly_data} 
              timezone_id={timezone_id} 
              timeSelected={timeSelected} 
              dataHourlyInSearch={dataHourlyInSearch} 
              set_recommend_info = {set_recommend_info}/>
              <ImageFooter latlong={latlong} postal_code={postal_code}/>
            </>}
          </div>
        }
    </ChakraProvider>
  );
}

export default LandingPage;
