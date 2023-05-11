import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  const [clothingType, setClothingType] = useState([]);
  const [clothCategory, setClothCategory] = useState([]);
  const [prefCategory, setPrefCategory] = useState([]);
  const [feelCategory, setFeelCategory] = useState([]);
  const [sportCategory, setSportCategory] = useState([]);
  useEffect(() => {
    fetch("https://api.mikebelus.net/clothCatAPI/getClothCategory")
      .then((res) => res.json())
      .then((data) => {
        setClothCategory(data);
      });
  }, []);
  useEffect(() => {
    fetch("https://api.mikebelus.net/clothAPI/getClothing")
      .then((res) => res.json())
      .then((data) => {
        setClothingType(data);
      });
  }, []);
  useEffect(() => {
    fetch("https://api.mikebelus.net/recommendAPI/getRecommends")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  const fetchRecord = () => {
    fetch("https://api.mikebelus.net/recommendAPI/getRecommends")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetchRecord();
  }, []);
  // useEffect(() => {
  //   fetch("https://api.mikebelus.net/prefAPI/getPreference")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPrefCategory(data);
  //     });
  // }, []);
  useEffect(() => {
    fetch("https://api.mikebelus.net/prefAPI/getPreferenceSport")
      .then((res) => res.json())
      .then((data) => {
        setSportCategory(data);
        //console.log(data)
      });
  }, []);
  useEffect(() => {
    fetch("https://api.mikebelus.net/prefAPI/getPreferenceFeel")
      .then((res) => res.json())
      .then((data) => {
        setFeelCategory(data);
      });
  }, []);

  const formatData = data?.map((item) => {
    const clothing = clothingType.find(
      (c) => c.clothing_id === item?.clothing_id
    );
    const category = clothCategory.find(
      (c) => c.clothing_category_id === item?.clothing_category_id
    );
    // const prefCat = prefCategory.find(
    //   (c) => c.preference_id === item?.preference_id
    // );
    const sportCat = sportCategory.find(
      (c) => c.preference_id === item?.sport_id
    );
    const feelCat = feelCategory.find(
      (c) => c.preference_id === item?.feel_id
    );
    return {
      id: item?.recommended_id,
      clothingType: clothing ? clothing?.clothing_type : "",
      clothing_id: item?.clothing_id,
      appTemp_Start: item?.apparent_temp_range_start,
      appTemp_End: item?.apparent_temp_range_end,
      clothinCategory: category ? category?.category_name : "",
      clothing_category_id: item?.clothing_category_id,
      //prefCat:prefCat? prefCat.preference :'',
      preference_id: item?.preference_id,
      sportCat:sportCat? sportCat.preference :'',
      sport_id: item.sport_id,
      feelCat:feelCat? feelCat.preference :'',
      feel_id:  item?.feel_id
    };
  });

  // preference_id

  return (
    <Card>
    
          <DataTable
            tableData={formatData}
            clothCategoryData={clothCategory}
            clothingTypeData={clothingType}
            //prefCategory={prefCategory}
            feelCategory={feelCategory}
            sportCategory={sportCategory}
            fetchRecord={fetchRecord}
            GetData={data}
          />
  
    </Card>
  );
}

export default TableData;
