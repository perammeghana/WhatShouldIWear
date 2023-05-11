import { Button, IconButton } from '@chakra-ui/react'
import { Center } from '@chakra-ui/react'
import { SettingsIcon } from '@chakra-ui/icons'
import { Icon } from '@chakra-ui/react'
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, HStack, Text } from '@chakra-ui/react'
import SliderMarkExample from "./SliderMarkExample"
import { useEffect, useState } from 'react'
import axios from "axios";
import Cookie from 'js-cookie';
import "./Setting.css"
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    Box
} from '@chakra-ui/react'
import {
    Tab,
    TabList,
    Tabs,
    Grid, GridItem
  } from "@chakra-ui/react";

const Settings = ({set_pref,setStyle,pref,set_recommend_info,style,dsearch, pref_id, set_pref_id, setImageSrc,defaultPrefIndex}) => {
    let dataComp = [];
    const [prefVals, prefValsFromDb] = useState([]);
    const [feelVals, feelValsFromDb] = useState([]);
    const [sliderValue, setSliderValue] = useState(50)
    const [sliderLabel, setSliderLabel] = useState("Normal");

    //localStorage.setItem("pref", "casual");
    useEffect(() => {
        async function getpreferences() {
            try {
                let res = await axios.get("https://api.mikebelus.net/prefAPI/getPreferenceSport");
                // alert(typeof(defaultPrefIndex));
                let defaultIndex = 0;
                res.data.map((item, index)=>{
                    if(item.preference_id == Cookie.get("Preference_id")){
                        defaultIndex = index;
                    }
                })
                prefValsFromDb(res.data);
                if(Cookie.get("Preference") != null){
                    console.log("set cookie pref")
                    set_pref(Cookie.get("Preference"));
                    set_pref_id(Cookie.get("Preference_id"));
                    Cookie.set("Preference", Cookie.get("Preference"));
                    Cookie.set("Preference_id", Cookie.get("Preference_id"));
                    Cookie.set("default_preference_index", defaultIndex);

                }else{
                    console.log("set default pref")
                    set_pref(res.data[0].preference)
                    set_pref_id(res.data[0].preference_id);
                    Cookie.set("Preference", res.data[0].preference);
                    Cookie.set("Preference_id", res.data[0].preference_id);
                    Cookie.set("default_preference_index", defaultIndex);
                }
                console.log(pref);

                // alert(pref);

            } catch (err) {
                console.log(err)
            }
        }
        async function getpreferencesFeel() {
            try {
                const vals =[0,50,100]
                let res = await axios.get("https://api.mikebelus.net/prefAPI/getPreferenceFeel");
                for (let index = 0; index < res.data.length; index++) {
                    res.data[index].value = vals[index];             
                }
                console.log(res.data)
                dataComp = res.data;
                feelValsFromDb(res.data)
                if(Cookie.get("feel") != null){
                    console.log("set cookie pref")
                    setStyle({
                        feel:Cookie.get("feel"),
                        feel_id:Cookie.get("feel_id")
                    })

                }else{
                    console.log("set default pref")
                    setStyle({
                        feel:"Normal",
                        feel_id:dataComp.find(item => item.preference === "Normal")?.preference_id
                    })
                    Cookie.set("feel_id", dataComp.find(item => item.preference === "Normal")?.preference_id);
                    Cookie.set("feel", "Normal");
                    Cookie.set("feel_value", sliderValue);
                }

            } catch (err) {
                console.log(err)
            }
        }
        getpreferences();
        getpreferencesFeel();
    }, []);
    function handleClick(pref_data,pref_id, index) {
        set_pref(pref_data);
        set_pref_id(pref_id);
        Cookie.set("Preference", pref_data);
        Cookie.set("Preference_id", pref_id);
        
        Cookie.set("default_preference_index", index);
        getrecommends(dsearch.ApparentTemp,pref_id,style.feel_id)
        const imageName = Cookie.get('Preference');
        if (imageName) {
            try {
                const imageUrl = require(`./ImagesForProj/${imageName}.png`);
                setImageSrc(imageUrl);
            } catch (error) {
                setImageSrc('');
            }
        
        }
    }

    const handleSliderChange = (value) => {
        setSliderValue(value); // Update the state with the new value
        const foundLabel = feelVals.find(item => item.value === value)?.preference;
        const feelid = feelVals.find(item => item.value === value)?.preference_id;
        if (foundLabel) {
            setSliderLabel(foundLabel); // Update the state with the found label
            setStyle({
                feel : foundLabel,
                feel_id:feelid
            });
            Cookie.set("feel_id", feelid);
            Cookie.set("feel", foundLabel);
            Cookie.set("feel_value", value);
            getrecommends(dsearch.ApparentTemp,pref_id,feelid)
        }
      };
    const getrecommends = async(appTemp,prefid,feelid) => {
        try {
            console.log(appTemp,prefid,feelid)
            let res = await axios.get("https://api.mikebelus.net/recommendAPI/getRecommendations?apparentTemp="+appTemp+"&sport_id="+prefid+"&feel_id="+feelid);
            console.log("recommend")
            console.log(res.data)
            set_recommend_info(res.data);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Popover >
            <PopoverTrigger>
                {/* <Button w={8} h={8} variant="link" position="absolute" right="5px" top="7px" colorScheme="#FFFFFF"> */}
                    <IconButton cursor={"pointer"} as={SettingsIcon} position="absolute" right="6px" top="12px" colorScheme="#FFFFFF" w={6} h={6} />
                {/* </Button> */}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontFamily={"Karma"} fontWeight={"600"} colorScheme="black" fontSize="lg">Please Select Your Preference</PopoverHeader>
                <PopoverBody>
                   
                    <Tabs variant='unstyled' defaultIndex={Cookie.get("default_preference_index")==null?0:Number(Cookie.get("default_preference_index"))}>
                   
                    <TabList>
                        <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={4}>
                            {prefVals.map((item, index) => (
                            <GridItem key={index}>
                                <Tab
                                    _selected={{ color: 'white', bg: 'black', outline : "2px solid black" }}
                                    onClick={() => { handleClick(item.preference, item.preference_id, index) }}
                                    w={"90px"} outline={"2px solid"} fontFamily={"Karma"}>
                                    {item.preference}
                                </Tab>
                            </GridItem>
                            ))}
                        </Grid>
                    </TabList>
                    </Tabs>
                    <Center>
                        <Text fontSize={"lg"} fontFamily="karma" mt="4vh" color={"black"}>
                            How do you feel?
                        </Text>
                    </Center>
                    <Box> {/* Set the desired width of the slider */}
                        <Slider step={50} min={0} max={100} defaultValue={Cookie.get("feel_value")==null? sliderValue:Cookie.get("feel_value")} onChange={handleSliderChange}> {/* Set the default value and handle change */}
                            <SliderTrack>
                            <SliderFilledTrack bg="black" /> {/* Set the background color of the "hot" portion */}
                            </SliderTrack>
                            <SliderThumb bg="white" boxShadow="0 0 0 1px black" >
                            <Tooltip label={sliderLabel} placement="top">
                                <Box h="100%" w="100%" />
                            </Tooltip>
                            </SliderThumb>
                        </Slider>
                        <Box d="flex" justifyContent="space-between"> {/* Create a container for labels */}
                            {feelVals.map((item) => (
                                <Text float={"left"} width={"33%"} key={item.preference}>{item.preference}</Text> 
                            ))}
                            {/* <Text>{sliderValue} ({sliderLabel})</Text> */}
                        </Box>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default Settings;