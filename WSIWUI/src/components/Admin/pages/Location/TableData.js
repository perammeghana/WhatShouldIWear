import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  const fetchRecord = () => {
    fetch("https://api.mikebelus.net/locationAPI/getLocations")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  useEffect(() => {
    fetchRecord();
  }, []);
  const formatData = data?.map((item) => ({
    id: item?.location_id,
    postalCaode: item?.postal_code,
    latitude: item?.latitude,
    longitude: item?.longitude,
    city: item?.city,
    state: item?.state,
    IsAvailable: item?.isAvailable,
    lastUpdated: item?.lastUpdated
  }));

  return (
    <Card>
      {<DataTable tableData={formatData} fetchRecord={fetchRecord}/>}
    </Card>
  );
}

export default TableData;
