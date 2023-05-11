import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import DataTable from "./DataTable";

function TableData() {
  const [data, setData] = useState([]);
  const fetchRecord = () => {
    fetch("https://api.mikebelus.net/logsAPI/getcronlogs")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  useEffect(() => {
    fetchRecord();
  }, []);
  const formatData = data?.map((item) => ({
    logid: item?.logid,
    AllOrSingleJobType: item?.AllOrSingleJobType,
    HourlyOrWeeklyJobType: item?.HourlyOrWeeklyJobType,
    RecordsCount: item?.RecordsCount,
    CronStartTime: new Date(item?.CronStartTime.slice(0, -1)).toLocaleString(),
    CronEndTime: new Date(item?.CronEndTime.slice(0, -1)).toLocaleString(),
    TimeTaken: item?.TimeTaken,
  }));

  return (
    <Card>
      {<DataTable tableData={formatData} fetchRecord={fetchRecord}/>}
    </Card>
  );
}

export default TableData;
