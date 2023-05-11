import React from 'react'
import {
    Box,
    Text,
    Image
} from '@chakra-ui/react'
import axios from "axios";
import { useRef } from 'react'
import './TimeContainer.css'
import Cookie from 'js-cookie';

const TimeContainer = ({hourlyInfo,set_recommend_info,set_time_selected,dataHourlyInSearch,pref_id, set_pref_id,style,
    setSelectedHourlyButton,selectedHourlyButton}) => {
    let mylist = hourlyInfo;
    const scrollRef = useRef(null);
    for (let i = 0; i < mylist.length; i++) {
        //const element = mylist[i];
        let dateNow = mylist[i].Date_Time !== null && mylist[i].Date_Time.split(",");
        const givenDate = new Date(dateNow[0]);
        const dateLet = new Date(dateNow);
        // Get month and day from the given date
        const givenMonth = String(givenDate.getMonth() + 1).padStart(2, '0');
        const givenDay = String(givenDate.getDate()).padStart(2, '0');
        let finalDate = `${givenMonth}/${givenDay}`;
        const givenHour = dateLet.toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true
        });
        const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
        //set time in banner default the first one
        // if(i==0)
        //     set_time_selected(mylist[0].formattedTime)
        mylist[i].finalDate = finalDate;
        mylist[i].formattedTime = formattedTime;
    }
      const handleButtonClick = (hourData,buttonId) => {
        setSelectedHourlyButton(buttonId);
        // Handle button click event here
        console.log("Button clicked!");
        set_time_selected(hourData.formattedTime)
        dataHourlyInSearch({
            Temperature : hourData.Temperature,
            Forecast : hourData.Forecast,
            ApparentTemp : hourData.ApparentTemp,
            PrecipitationPotential : hourData.PrecipitationPotential,
            wind : hourData.SurfaceWind,
            windDire : hourData.WindDir
          })
          if(pref_id === null)
          set_pref_id(Cookie.get("Preference_id"));
        getrecommends(hourData.ApparentTemp,pref_id,style.feel_id);
      };
      const handleScrollLeft = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft -= 200;
        }
      };
    
      const handleScrollRight = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 200;
        }
      };
    const getrecommends = async(appTemp,prefid,feelid) => {
        console.log(appTemp,prefid,feelid)
        try {
            let res = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
            console.log("recommend")
            console.log(res.data)
            set_recommend_info(res.data);
        } catch (err) {
            console.log(err)
        }
    }
    const showArrows = scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
    return (
        <div className='hourlyContainer'>
            {showArrows && (
            <div className='scroll-btn' onClick={handleScrollLeft}>
                <img src={require('./ImagesForProj/left-arrow.png')} alt='left arrow' />
            </div>
             )}
            <div className='timedivHour' style={{ width: '96%', overflowX: 'auto' }} ref={scrollRef}>
                {mylist.map((item, index) => (
                <div key={index}>
                    <Text fontFamily={'Karma'}>{item.finalDate}</Text>
                    <Box
                    as='button'
                    border={selectedHourlyButton === index + 1 ? '2px solid black' : ''}
                    background={selectedHourlyButton === index + 1 ? '#D1D0CE' : '#EFEFEF'}
                    w='70px'
                    p={1}
                    color='black'
                    mx='0.2rem'
                    onClick={() => handleButtonClick(item, index + 1)}
                    >
                    <Text fontFamily={'Karma'} textAlign={'center'}>
                        {item.formattedTime}
                    </Text>
                    <Image
                        boxSize='40px'
                        objectFit='cover'
                        src={require(`./HourlyImages/${item.Forecast}.png`)}
                        alt={item.Forecast}
                        margin={'auto'}
                    />
                    <Text fontFamily={'Karma'} textAlign={'center'}>
                        {item.Temperature}°F
                    </Text>
                    </Box>
                </div>
                ))}
            </div>
            {showArrows && (
            <div className='scroll-btn' onClick={handleScrollRight}>
                <img src={require('./ImagesForProj/right-arrow.png')} alt='left arrow' />
            </div>
            )} 
        </div>
    )
}

export default TimeContainer
