import React, { useState,useEffect } from "react";
import MUIDataTable from "mui-datatables";

function DataTable({ tableData, fetchRecord }) {
  const [data, setData] = useState(tableData);
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const columns = [
    {
      label: "LogId",
      name: "logid",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      label: "Job Type(All/Single)",
      name: "AllOrSingleJobType",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
        label: "Job Type(Hourly/Weekly)",
        name: "HourlyOrWeeklyJobType",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "Record Count",
        name: "RecordsCount",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "Cron StartTime",
        name: "CronStartTime",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "Cron EndTime",
        name: "CronEndTime",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        label: "Time Taken",
        name: "TimeTaken",
        options: {
          filter: true,
          sort: true,
        },
      },
    // {
    //   label: "ACTIONS",
    //   name: "Actions",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     empty: true,
    //     customBodyRenderLite: (dataIndex) => {
    //       return (
    //         <Box
    //           sx={{
    //             display: "flex",
    //           }}
    //         >
    //           <Tooltip title="Edit Item" arrow>
    //             <IconButton
    //               color="inherit"
    //               size="small"
    //               onClick={() => updateRecord(dataIndex, data[dataIndex].id)}
    //             >
    //               <EditTwoToneIcon fontSize="small" />
    //             </IconButton>
    //           </Tooltip>
    //           <Tooltip title="Delete Item" arrow>
    //             <IconButton
    //               color="inherit"
    //               size="small"
    //               onClick={() => handleClickOpen(data[dataIndex].id)}
    //             >
    //               <DeleteTwoToneIcon fontSize="small" />
    //             </IconButton>
    //           </Tooltip>
    //         </Box>
    //       );
    //     },
    //   },
    // },
  ];

  const options = {
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    filterType: "dropdown",
    responsive: "vertical",
    selectableRowsHeader: false,
    selectableRows: "none",
    onColumnSortChange: (changedColumn, direction) =>
      console.log("changedColumn: ", changedColumn, "direction: ", direction),
    onChangeRowsPerPage: (numberOfRows) =>
      console.log("numberOfRows: ", numberOfRows),
    onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
    // onRowsDelete: () => {
    //   setOpen(true);
    // },
    // onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
    //   const filteredData = rowsSelected.map((a) =>
    //     data.filter((record, index) => index === a)
    //   );
    //   const ids = filteredData.map((a) => a[0].id);
    //   setSelectedRows(ids);
    // },
  };

  const vertical = "bottom";
  const horizontal = "right";

  return (
    <>
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
      />
    </>
  );
}

export default DataTable;
