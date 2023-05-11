import React from 'react'
import { Text, Button,  FormControl, FormErrorMessage, Input, Textarea, VStack } from '@chakra-ui/react'
import "./CaptionCarousel.css"
import { CloseIcon } from '@chakra-ui/icons';
import axios from "axios";
import Cookie from 'js-cookie';
import emailjs from '@emailjs/browser';
import Modal from "react-modal";
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
Modal.setAppElement("#root");

const CaptionCarousel = ({setDay,set_hourly_info,dataHourlyInSearch,loc_id,timezone_id,recommend_data,set_pref_id, pref_id,
  setSelectedWeeklyButton,dsearch,
  set_time_selected,pref,recommDay,timeSelected,style,set_recomm_day,setSelectedHourlyButton,set_recommend_info,timezone_id_abbr}) => {
  // const { preference, preferenceId } = pref;
  function handleClick() {
    localStorage.setItem("day", "Today");
    setDay(localStorage.getItem("day"))
    getHourlyData();
  }
  const [isOpen, setIsOpen] = useState(false);

    const [isOpen1, setIsOpen1] = useState(false);

    const sendEmail = (values) => {

        // e.preventDefault();
        // console.log(formik.values);
        emailjs.send('service_poacdlm', 'template_b8b7qv3', values, 'xY_EnVNwuQX0yJBkr')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      };

    const formik = useFormik({
        initialValues:{
            user_name: "",
            user_email: "",
            user_feedback: ""
        },
        validationSchema: Yup.object({
            user_name: Yup.string()
                .required("User name required")
                .min(5, "User name is too short"),
            user_email: Yup.string()
                .required("User email required")
                .min(5, "User email is too short"),
            user_feedback: Yup.string()
                .required("User feedback required")
                .min(5, "User feedback is too short")
        }),
        onSubmit: (values, actions) =>{

            let data = {
                user_name: values.user_name,
                user_email: values.user_email,
                user_feedback: values.user_feedback
            }
            sendEmail(data);
            actions.resetForm();
            toggleThankingModal();
        }
    });
    
    function toggleModal() {

      setIsOpen(!isOpen);
    }

    function toggleThankingModal() {

        setIsOpen(false);
        setIsOpen1(!isOpen1);
    }

  const getHourlyData= async()=>{
    console.log("in hourly")
    try {
      let res = await axios.get("https://api.mikebelus.net/weatherAPI/getWeatherDataHourly?id="+loc_id+"&tz="+timezone_id+"&date=2023-04-10&day=today");
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
          //get the first hour data in the banner
          let dateNow = res.data[0].Date_Time !== null && res.data[0].Date_Time.split(",");
          const dateLet = new Date(dateNow);
            const givenHour = dateLet.toLocaleString('en-US', {
            hour: 'numeric',
            hour12: true
            });
            const formattedTime = givenHour === "12 AM" ? "12 AM" : givenHour;
            set_time_selected(formattedTime)
            setSelectedHourlyButton(1)
            setSelectedWeeklyButton(1)
            set_recomm_day("Today")
            if(pref_id === null)
              set_pref_id(Cookie.get("Preference_id"));
            getrecommends(res.data[0].ApparentTemp,pref_id,style.feel_id)
      }
      else{
        set_hourly_info([]);
        dataHourlyInSearch([]);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const getrecommends = async(appTemp,prefid,feelid) => {
    try {
        let res = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
        console.log("recommend in today")
        console.log(res.data)
        set_recommend_info(res.data);
    } catch (err) {
        console.log(err)
    }
}
  let setData = [];
  setData = recommend_data;
  return (
      <div>
        <div className="feedback">
        <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="My dialog" className="mymodal" id="feedback">
            <Button position={"absolute"} right={"5px"} top={"10px"} alignContent={"center"} onClick={toggleModal} padding={"5px"}>
                <CloseIcon />
            </Button>
            <VStack as="form" marginTop={"0px"} marginLeft={"0px"} justifyContent="center" onSubmit={formik.handleSubmit} padding={"20px"}>
                <FormControl isInvalid={formik.errors.user_name}>
                    <Input value={formik.user_name} onChange={formik.handleChange} border={"2px solid black"} borderRadius={"5px"} height={"40px"} marginTop={"20px"} width={"250px"}  placeholder='Enter Name' name="user_name"/>
                    <FormErrorMessage color="red">{formik.errors.user_name}</FormErrorMessage>
                </FormControl>
                    <br/>
                <FormControl isInvalid={formik.errors.user_email}>
                    <Input value={formik.user_email} onChange={formik.handleChange} border={"2px solid black"} borderRadius={"5px"} height={"40px"} width={"250px"} placeholder='Enter Email Id' name="user_email"/>
                    <FormErrorMessage color="red">{formik.errors.user_email}</FormErrorMessage>
                </FormControl>
                    <br/>
                <FormControl isInvalid={formik.errors.user_feedback}>
                    <Textarea value={formik.user_feedback} resize={"both"} onChange={formik.handleChange} border={"2px solid black"} borderRadius={"5px"} height={"80px"} width={"250px"} placeholder='Give Feedback' name="user_feedback"/>
                    <FormErrorMessage color="red">{formik.errors.user_feedback}</FormErrorMessage>
                </FormControl>
                    <br/>
                <FormControl textAlign={"center"}>                    
                <Button type="submit" variant="solid" colorScheme={"black"} bg="black" color={"white"} padding={"5px"} borderRadius={"5px"} height={"40px"} > Send Feedback</Button>
                </FormControl>
            </VStack>
        </Modal>

        <Modal isOpen={isOpen1} onRequestClose={toggleThankingModal} contentLabel="My dialog" className="mymodal" id="thanks-feedback">
            <Button position={"absolute"} right={"5px"} top={"5px"} alignContent={"center"} onClick={toggleThankingModal}>
                <CloseIcon />
            </Button>
            <div padding={"10px"}>
                <div style={{fontSize: "20px", fontWeight: "600"}} >
                    <br/>
                    Thank you for the feedback
                </div>
            </div>
        </Modal>
        
        </div>
        <div className='cont' id="cont">
          <div>
            <Text pl={"2vh"} fontSize={"xl"} fontFamily={"Karma"} float={"left"} textAlign="center">
            {recommDay + "'s ("+timeSelected+" "+timezone_id_abbr+") clothing suggestions"}
            </Text>
            {recommDay !== 'Today' &&
            <Button display={"block"} fontFamily={"Karma"} marginRight={"10px"} textAlign={"center"} className="my-custom-button" height={"2.25rem"}
             bottom="0" bg="black" textColor={"white"} marginBottom={"6px"} float={"right"} onClick={() => handleClick()}>Back to Today</Button>
            }
          </div>
          <div className='containerX'>
          {setData.length === 0 ? (
            <Text fontSize={'md'} textAlign={"center"} fontFamily={"Karma"} fontWeight={'medium'}>We currently don't have any recommendations for {style.feel} and {pref} preference when it feels like {dsearch.ApparentTemp}° F	. We're working on improving our recommendations - send us <u><a onClick={toggleModal}>feedback</a></u> if you have a recommendation for what you would normally wear in the current conditions!</Text>
          ) : (
          setData.map((item,index) => (
                <div key={index} className='container1'>
                  <div className='container2'>
                    <img alt="NONE" src={item.clothing_image_path} className='imginslider'></img>
                    <Text fontSize={'xl'} textAlign={"center"} fontFamily={"Karma"} fontWeight={'bold'}>{item.Clothing_type}</Text>
                  </div>
              </div>
            )
            )
          )}
          </div>
        </div>
        
      </div>

  )
}

export default CaptionCarousel