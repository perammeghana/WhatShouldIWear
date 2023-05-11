import React, { useEffect, useState,useRef } from 'react'
import axios from "axios";
import { Image } from '@chakra-ui/react'
import { Button, Text } from '@chakra-ui/react'
import './Info1.css'
import Cookie from 'js-cookie';
import {
    Box,
} from '@chakra-ui/react';

const Info1 = ({weekly_data,updateCount,timezone_id,set_hourly_info,loc_id,setSelectedHourlyButton,set_time_selected, set_pref_id,
    style,pref,timeSelected,dataHourlyInSearch,set_recommend_info,setSelectedWeeklyButton,selectedWeeklyButton, pref_id}) => {
    const data = [];
    var count = 0;

    for(let i = 0; i < weekly_data.length; i++){	
        if(weekly_data[i][0].min_temp > 0)
        {
            data.push(weekly_data[i]);
            count ++;
        }    
    }	
    if(count !== 6)
        data.push("Empty");	

    const [showArrows, setShowArrows] = useState(false);
    const scrollRef = useRef(null);
    let filterHourly = [];
    useEffect(() => {
        const handleResize = () => {
          setShowArrows(
            scrollRef.current.scrollWidth > scrollRef.current.clientWidth
          );
        }; 
        // Wait for the component to render before calculating the scroll width
        setTimeout(handleResize, 0);   
        window.addEventListener('resize', handleResize);    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [weekly_data]);
    function handleClick(day,date,i) {
        //console.log(date)
        setSelectedWeeklyButton(i)
        updateCount(day);
        localStorage.setItem("day", day);
        getHourlyData(loc_id,date,day)
        const element = document.getElementById('cont');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    const getHourlyData= async(locid,dateWeekly,day)=>{
        try {
            let res;
            let selectedTime;
            if(day === 'Today'){
                res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataHourly?id="+locid+"&tz="+timezone_id+"&date="+dateWeekly+"&day=today");
            }
            else{
                res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataHourly?id="+locid+"&tz="+timezone_id+"&date="+dateWeekly+"&day=other");
            }
            if(res.data.length > 0){
                filterHourly = res.data;
                for (let i = 0; i < filterHourly.length; i++) {
                    let dateNow = filterHourly[i].Date_Time !== null && filterHourly[i].Date_Time.split(",");
                    const dateLet = new Date(dateNow);
                    const givenHour = dateLet.toLocaleString('en-US', {
                        hour: 'numeric',
                        hour12: true
                    });
                    const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
                    filterHourly[i].formattedTime = formattedTime;
                    filterHourly[i].id = i+1;
                }
                selectedTime = filterHourly.find(
                    (c) => c.formattedTime === timeSelected
                );
                console.log(selectedTime)
                if(selectedTime === undefined){
                    set_time_selected("12 AM")
                    selectedTime = filterHourly.find(
                        (c) => c.formattedTime === "12 AM"
                    );
                }
                dataHourlyInSearch({
                    Temperature : selectedTime.Temperature,
                    Forecast : selectedTime.Forecast,
                    ApparentTemp : selectedTime.ApparentTemp,
                    PrecipitationPotential : selectedTime.PrecipitationPotential,
                    wind : selectedTime.SurfaceWind,
                    windDire : selectedTime.WindDir
                })
                if(pref_id === null)
                    set_pref_id(Cookie.get("Preference_id"));
                getrecommends(res.data[0].ApparentTemp,pref_id,style.feel_id)
                setSelectedHourlyButton(selectedTime.id)
                set_hourly_info(res.data);
            }
            else{
                set_hourly_info([]);
                set_recommend_info([]);
            }
        } catch (err) {
          console.log(err)
        }
    }
    const getrecommends = async(appTemp,prefid,feelid) => {
        try {
            let res = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
            console.log("recommend in weekly")
            console.log(res.data)
            set_recommend_info(res.data);
        } catch (err) {
            console.log(err)
        }
    }
    const handleScrollLeftWeekly = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 200;
        }
    };   
    const handleScrollRightWeekly = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft += 200;
    }
    };
    return (
        <div className='weeklyContainer'>
        {showArrows && (
            <div className='scroll-btn-weekly' onClick={handleScrollLeftWeekly}>
                <img src={require('./ImagesForProj/left-arrow.png')} alt='left arrow' />
            </div>
             )}
        <div className='timediv' style={{ width: '100%', overflowX: 'auto' }} ref={scrollRef}>
            {
                data.length > 0 &&
                data.map((item,index) => 
                (
                    item === "Empty" ?
                    <Box key={data.length+1} border={selectedWeeklyButton === data.length+1 ? "2px solid black" : ""} background={selectedWeeklyButton === data.length+1 ? "#D1D0CE" : "#EFEFEF"} mx="0vw" margin={"10px"}>
                        <div className='infocont'>

                                <Box p={1}>
                                    <Box
                                        px={2}
                                        py={1}
                                        color="black"
                                        // mb={2}
                                        >
                                        <Text fontFamily={"Karma"} fontSize={'xl'} fontWeight="bold" textAlign="center">
                                            We will get more information. Please be back after some time.
                                        </Text>
                                    </Box>
                                </Box>
                        </div>
                    </Box>
                    :
                    item[0].min_temp >0 &&
                    <Box key={index} border={selectedWeeklyButton === index+1 ? "2px solid black" : ""} background={selectedWeeklyButton === index+1 ? "#D1D0CE" : "#EFEFEF"} mx="0vw" margin={"10px"}>
                        <div className='infocont'>
                            <div className = 'infoDiv'>
                                <Box p={1}>
                                    <Box
                                        px={2}
                                        py={1}
                                        color="black"
                                        // mb={2}
                                        >
                                        <Text fontFamily={"Karma"} fontSize={'xl'} fontWeight="bold" textAlign="center">
                                            {item[0].day}
                                        </Text>
                                    </Box>
                                </Box>
                                <Text fontFamily={"Karma"} marginLeft={"1vw"}>Min Temp: {item[0].min_temp}° F</Text>
                                <Text fontFamily={"Karma"} marginLeft={"1vw"}>Max Temp: {item[0].max_temp}° F</Text>
                                <Text fontFamily={"Karma"} marginLeft={"1vw"}>Wind: {item[0].avg_SurfaceWind} mph</Text>
                            </div>
                            <div className='infoImgDiv'>
                                <Image float={"left"} src={require(`./HourlyImages/${item[0].forecast}.png`)} alt='op' h="4vh" />
                                <Text float={"left"} fontFamily={"Karma"}>{item[0].forecast}</Text>
                            </div>
                        </div>
                        <Button bottom="0" width={"100%"} variant="solid" colorScheme={"black"} bg="black" 
                            onClick={() => handleClick(item[0].day,item[0].date,index+1)}>
                            <Text fontFamily={"Karma"} textAlign={"center"} bottom="0" bg="black" color="white" w="90%" m="auto">See Forecast</Text>
                        </Button>
                    </Box>
                ))  
            }
            
        </div>
        {showArrows && (
            <div className='scroll-btn-weekly' onClick={handleScrollRightWeekly}>
                <img src={require('./ImagesForProj/right-arrow.png')} alt='left arrow' />
            </div>
        )} 
        </div>
    )
}

export default Info1