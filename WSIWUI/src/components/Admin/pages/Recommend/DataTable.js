import React, { useState, useEffect } from "react";

import {
  Tooltip,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  // CircularProgress
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MUIDataTable from "mui-datatables";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function DataTable({
  tableData,
  clothingTypeData,
  clothCategoryData,
  //prefCategory,
  feelCategory,
  sportCategory,
  fetchRecord,
  GetData
}) {
  let datacheck = GetData;
  const [error,setError]=useState()
  const [openAlert, setOpenAlert] = React.useState(false);
  const [toastMessge, setToastMessge] = useState();
  const [open, setOpen] = useState(false);
  const [openItemDialogue, setOpenItemDialogue] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [updateRecordModal, setUpdateRecordModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [updateAbleId, setUpdateAbleId] = useState();
  const [data, setData] = useState(tableData);
  const [activeIndex, setActiveIndex] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [clothCategoriesData, setClothCategory] = useState([]);
  // const [values, setValues] = React.useState({
  //   clothingType: "",
  //   clothinCategory: "",
  //   appTemp_Start: "",
  //   appTemp_End: "",
  //   preference_id:""
  // });
  const [values, setValues] = React.useState({
    clothingType: "",
    clothinCategory: "",
    appTemp_Start: "",
    appTemp_End: "",
    sportCat:"",
    feelCat:""
  });
  const [ranges, setRanges] = useState([
    { start: 65, end: 120 },
    { start: 125, end: 150 },
    { start: 155, end: 170 },
  ]);

  const [newRange, setNewRange] = useState({ start: '', end: '' });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  function isValidRange(newStart, newEnd, uniqueRanges) {
    for (let i = 0; i < uniqueRanges.length; i++) {
      const start = parseInt(uniqueRanges[i].start);
      const end = parseInt(uniqueRanges[i].end);
      if (newStart === start && newEnd === end) {
        // The new range is the same as an existing range
        return true;
      }
      if (newStart >= start && newEnd < end) {
        console.log("1")
        console.log(newStart , start , newEnd , end)
        // The new range is entirely within an existing range
        return false;
      }
      if (newStart <= start && newEnd > end) {
        console.log("2")
        console.log(newStart , start , newEnd , end)
        // The new range entirely contains an existing range
        return false;
      }
      if (newStart < end && newEnd >= end) {
        console.log("3")
        console.log(newStart , end , newEnd , end)
        // The new range overlaps the end of an existing range
        return false;
      }
      if (newEnd > start && newStart <= start) {
        console.log("4")
        console.log(newEnd , start , newStart , start)
        // The new range overlaps the start of an existing range
        return false;
      }
    }
    return true;
  }
  
  
  const handleSubmit = async () => {
    // if(values.feelCat ===""||values.sportCat ===""|| values.clothingType ==="" || values.clothing_category_id==="" ||values.appTemp_Start==="" ||values.appTemp_End===""){
    //   setError("Please provide all fields to continue");
    //   return
    // }
    newRange.start = parseInt(values.appTemp_Start)
    newRange.end = parseInt(values.appTemp_End)
    const filteredData = datacheck.filter(
      (item) =>
        item.sport_id === values.sportCat &&
        item.feel_id === values.feelCat
    );
    const uniqueRanges = [];
    filteredData.forEach((item) => {
      const start = item.apparent_temp_range_start;
      const end = item.apparent_temp_range_end;
      
      let isNewRange = true;
      
      for (let i = 0; i < uniqueRanges.length; i++) {
        if (uniqueRanges[i].start === start && uniqueRanges[i].end === end) {
          isNewRange = false;
          break;
        }
      }     
      if (isNewRange) {
        uniqueRanges.push({ start, end });
      }
    });
    console.log(uniqueRanges)
    if(newRange.start === newRange.end){
      setError("Apparent temp start and end cannot be the same");
      return;
    }
    if(newRange.start > newRange.end){
      setError("Apparent temp start should be greater than apparent temp end");
      return;
    }
    if (isValidRange(newRange.start, newRange.end, uniqueRanges)) {
      console.log('Allow adding data');
      await fetch("https://api.mikebelus.net/recommendAPI/addRecommend", {
        method: "POST",
        body: JSON.stringify({
          clothing_id: values.clothingType,
          clothing_category_id: values.clothing_category_id,
          apparent_temp_range_start: values.appTemp_Start,
          apparent_temp_range_end: values.appTemp_End,
          feel_id:values.feelCat,
          sport_id:values.sportCat
          //preference_id:values.preference_id
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      });
      fetchRecord();
      // const newDataArray = [...data, dataToAdd];
      // setData(newDataArray);
      setOpenAlert(true);
      setToastMessge("New Record Added Successfully!");
      setRecordModal(false);
      setValues({
        clothingType: "",
        clothinCategory: "",
        appTemp_Start: "",
        appTemp_End: "",
        //preference_id:"",
        sportCat:"",
        feelCat:""
      });
      setError()
    } 
    else {
      setError("Error in apparent temperature range!");
      console.log('Values are not valid, do not allow adding data');
    }
  };
  const handleAddClose = () =>{
    setValues({
      clothingType: "",
      clothinCategory: "",
      appTemp_Start: "",
      appTemp_End: "",
      //preference_id:"",
      sportCat:"",
      feelCat:""
    });
    setError()
  }
  useEffect(() => {
    setData(tableData);
  }, [tableData]);
  const columns = [
    {
      label: "ID",
      name: "id",
      options: {
        display: false,
        filter: false,
        sort: false,
      },
    },
    
    {
      label: "Clothing Category",
      name: "clothinCategory",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },

    {
      label: "Clothing Type",
      name: "clothingType",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },

    // {
    //   label: "Preference",
    //   name: "prefCat",
    //   options: {
    //     filter: true,
    //     sort: false,
    //   },
    // },
   
    {
      label: "Preference Sport Category",
      name: "sportCat",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },
    {
      label: "Preference Feel Category",
      name: "feelCat",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },
    {
      label: "AppTemp_Start",
      name: "appTemp_Start",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },
    {
      label: "AppTemp_End",
      name: "appTemp_End",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },



    {
      label: "ACTIONS",
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Tooltip title="Edit Item" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => updateRecord(dataIndex, data[dataIndex].id)}
                >
                  <EditTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Item" arrow>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleClickOpen(data[dataIndex].id)}
                >
                  <DeleteTwoToneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    },
  ];

  const options = {
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    responsive: "vertical",
    onColumnSortChange: (changedColumn, direction) =>
      console.log("changedColumn: ", changedColumn, "direction: ", direction),
    onChangeRowsPerPage: (numberOfRows) =>
      console.log("numberOfRows: ", numberOfRows),
    onChangePage: (currentPage) => console.log("currentPage: ", currentPage),
    onRowsDelete: () => {
      setOpen(true);
    },
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      const filteredData = rowsSelected.map((a) =>
        data.filter((record, index) => index === a)
      );
      const ids = filteredData.map((a) => a[0].id);
      setSelectedRows(ids);
    },
  };

  // Delete Modal
  const handleClickOpen = (id) => {
    setOpenItemDialogue(true);
    setItemId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleItemDialogueClose = () => {
    setOpen(false);
    setOpenItemDialogue(false);
  };
  const confirmDelete = () => {
    fetch(`https://api.mikebelus.net/recommendAPI/deleteRecommend/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    }).then(() => console.log("Delete successful"));
    fetchRecord();
    const filteredDataArray = data.filter((item) => item.id !== itemId);
    setData(filteredDataArray);
    setOpenAlert(true);
    setToastMessge("Deleted Successfully!");
    setOpenItemDialogue(false);
  };
  const confirmDeleteBulk = async () => {
    try {
    const result = await fetch(
      "https://api.mikebelus.net/recommendAPI/deleteRecommendBulk",
      {
        method: "DELETE",
        body: JSON.stringify({
          recommend_ids: selectedRows,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    if (result.status === 200) {
      const filteredDataArray = data.filter(
        (item) => !selectedRows.includes(item.id)
      );
    setOpenAlert(true);
    setData(filteredDataArray);
    setToastMessge("Deleted Successfully!");
    setOpen(false);
  } else {
    const response = await result.json();
    setOpenAlert(true);
    setToastMessge("Something went wrong!");
  }
  } catch (err) {
    setOpenAlert(true);
    setToastMessge("Something went wrong!");
  }
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const updateRecord = (id, catId) => {
    setUpdateAbleId(catId);
    setActiveIndex(id);
    setValues(data[id]);
    setUpdateRecordModal(true);
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    newRange.start = parseInt(values.appTemp_Start)
    newRange.end = parseInt(values.appTemp_End)
    console.log(datacheck)
    const removedFilter = datacheck.filter(
      (item) =>
        item.sport_id === values.sport_id &&
        item.feel_id === values.feel_id &&
        item.recommended_id === updateAbleId
    );
    const filteredData = datacheck.filter(
      (item) =>
        item.sport_id === values.sport_id &&
        item.feel_id === values.feel_id &&
        !removedFilter.some(
          (removedItem) =>
            removedItem.apparent_temp_range_start === item.apparent_temp_range_start &&
            removedItem.apparent_temp_range_end === item.apparent_temp_range_end
        )
    );
    const uniqueRanges = [];
    filteredData.forEach((item) => {
      const start = item.apparent_temp_range_start;
      const end = item.apparent_temp_range_end;
      
      let isNewRange = true;
      
      for (let i = 0; i < uniqueRanges.length; i++) {
        if (uniqueRanges[i].start === start && uniqueRanges[i].end === end) {
          isNewRange = false;
          break;
        }
      }     
      if (isNewRange) {
        uniqueRanges.push({ start, end });
      }
    });
    console.log(uniqueRanges)
    if(newRange.start === newRange.end){
      setError("Apparent temp start and end cannot be the same");
      return;
    }
    if(newRange.start > newRange.end){
      setError("Apparent temp start should be greater than apparent temp end");
      return;
    }
    if (isValidRange(newRange.start, newRange.end, uniqueRanges)) {
      console.log('Allow adding data edit');
      await fetch("https://api.mikebelus.net/recommendAPI/editRecommend", {
        method: "PUT",
        body: JSON.stringify({
          recommended_id: updateAbleId,
          clothing_id: values.clothing_id,
          clothing_category_id: values.clothing_category_id,
          apparent_temp_range_start: values.appTemp_Start,
          apparent_temp_range_end: values.appTemp_End,
          feel_id:values.feel_id,
          sport_id:values.sport_id
          //preference_id:values.preference_id
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      });
      fetchRecord();
      // const dataToUpdate = [...data];
      // dataToUpdate[activeIndex] = values;
      // setData(dataToUpdate);
      setUpdateRecordModal(false);
      setValues({
        clothingType: "",
        clothinCategory: "",
        appTemp_Start: "",
        appTemp_End: "",
        // preference_id:""
        sportCat:"",
        feelCat:""
      });
    } else {
      console.log("Error in temp")
      setError("Error in apparent temperature range!");
    }
  };

  useEffect(() => {
    if(values.clothing_category_id){
      fetch(`https://api.mikebelus.net/clothAPI/getClothingByCategory?id=${values.clothing_category_id}`)
      .then((res) => res.json())
      .then((data) => {
        setClothCategory(data);
      });
    }
  }, [values.clothing_category_id])

  const vertical = "bottom";
  const horizontal = "right";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
          p: 2,
        }}
      >
        <Button
          sx={{
            py: "10px",
            backgroundColor: "#000000",
          }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => setRecordModal(true)}
        >
          Add
        </Button>
      </Box>
      {tableData.length > 0 &&
        clothingTypeData.length > 0 &&
        clothCategoryData.length > 0 &&


        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
      }
      {/* Toast */}
      <Box>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openAlert}
          autoHideDuration={1300}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {toastMessge && toastMessge}
          </Alert>
        </Snackbar>
      </Box>
      {/* Add New Record Popup */}
      <Dialog
        open={recordModal}
        onClose={() => {setRecordModal(false); setError()}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add a new record "}</DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-clothinCategory">
                Category Name
              </InputLabel>
              <Select
                labelId="outlined-adornment-clothinCategory"
                d="outlined-adornment-clothinCategory"
                value={values.clothing_category_id}
                label="Category Name"
                onChange={handleChange("clothing_category_id")}
                sx={{
                  width: "100%",
                }}
              >
                {clothCategoryData?.map((item, index) => {
                 
                  return (
                    <MenuItem value={item?.clothing_category_id} key={index}>
                      {item?.category_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-clothingType">
                Clothing Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-clothingType"
                d="outlined-adornment-clothingType"
                value={values.clothingType}
                label="Clothing Type"
                onChange={handleChange("clothingType")}
                sx={{
                  width: "100%",
                }}
              >
                {clothCategoriesData?.map((item, index) => {
               
                  return (
                    <MenuItem value={item?.clothing_id} key={index}>
                      {item?.clothing_type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-AppTemp_Start">
                AppTemp_Start
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-AppTemp_Start"
                value={values.appTemp_Start}
                onChange={handleChange("appTemp_Start")}
                label="AppTemp_Start"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-AppTemp_End">
                AppTemp_End
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-AppTemp_End"
                value={values.appTemp_End}
                onChange={handleChange("appTemp_End")}
                label="AppTemp_End"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference_id">
                Preference Sport Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-preference_id"
                d="outlined-adornment-preference_id"
                value={values.sportCat}
                label="Clothing Type"
                //onChange={handleChange("preference_id")}
                onChange={handleChange("sportCat")}
                sx={{
                  width: "100%",
                }}
              >
                {/* {prefCategory?.map((item, index) => { */}
                {sportCategory?.map((item, index) => {
                  return (
                    <MenuItem value={item?.preference_id} key={index}>
                      {item?.preference}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference_id">
                Preference Feel Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-preference_id"
                d="outlined-adornment-preference_id"
                value={values.feelCat}
                label="Clothing Type"
                //onChange={handleChange("preference_id")}
                onChange={handleChange("feelCat")}
                sx={{
                  width: "100%",
                }}
              >
                {/* {prefCategory?.map((item, index) => { */}
                {feelCategory?.map((item, index) => {
                  return (
                    <MenuItem value={item?.preference_id} key={index}>
                      {item?.preference}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <div className='errorDiv' id="errorsPass">
                    {error ? error : null }
                  </div>
          </Grid>
        </Grid>
   
        <DialogActions>
          <Button onClick={() => {setRecordModal(false); handleAddClose()}}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Update  Record Popup */}
      <Dialog
        open={updateRecordModal}
        onClose={() => {setUpdateRecordModal(false);setError()}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Record"}</DialogTitle>
        <Grid container spacing={2} px="20px">

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-clothinCategory">
                Category Name
              </InputLabel>
              <Select
                labelId="outlined-adornment-clothinCategory"
                d="outlined-adornment-clothinCategory"
                value={values.clothing_category_id}
                label="Category Name"
                onChange={handleChange("clothing_category_id")}
                sx={{
                  width: "100%",
                }}
              >
               
                {clothCategoryData?.map((item, index) => {
                  return (
                    <MenuItem value={item?.clothing_category_id} key={index}>
                      {item?.category_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-clothingType">
                Clothing Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-clothingType"
                d="outlined-adornment-clothingType"
                value={values.clothing_id}
                label="Clothing Type"
                onChange={handleChange("clothing_id")}
                sx={{
                  width: "100%",
                }}
              >
            
                {clothCategoriesData?.map((item, index) => {
                  return (
                    <MenuItem value={item?.clothing_id} key={index}>
                      {item?.clothing_type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-AppTemp_Start">
                AppTemp_Start
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-AppTemp_Start"
                value={values.appTemp_Start}
                onChange={handleChange("appTemp_Start")}
                label="AppTemp_Start"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-AppTemp_End">
                AppTemp_End
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-AppTemp_End"
                value={values.appTemp_End}
                onChange={handleChange("appTemp_End")}
                label="AppTemp_End"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference_id">
                Preference Sport Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-preference_id"
                d="outlined-adornment-preference_id"
                value={values.sport_id}
                label="Clothing Type"
                onChange={handleChange("sport_id")}
                sx={{
                  width: "100%",
                }}
              >
                {/* {prefCategory?.map((item, index) => { */}
             
                {sportCategory?.map((item, index) => {
                  return (
                    <MenuItem value={item?.preference_id} key={index}>
                      {item?.preference}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-preference_id">
                Preference Feel Type
              </InputLabel>
              <Select
                labelId="outlined-adornment-preference_id"
                d="outlined-adornment-preference_id"
                value={values.feel_id}
                label="Clothing Type"
                onChange={handleChange("feel_id")}
                sx={{
                  width: "100%",
                }}
              >
                {/* {prefCategory?.map((item, index) => { */}
                {feelCategory?.map((item, index) => {
                  return (
                    <MenuItem value={item?.preference_id} key={index}>
                      {item?.preference}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <div className='errorDiv' id="errorsPass">
                    {error ? error : null }
                  </div>
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={() => {setUpdateRecordModal(false); handleAddClose()}}>Cancel</Button>
          <Button onClick={handleUpdate} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Popup */}
      <Dialog
        open={openItemDialogue}
        onClose={handleItemDialogueClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to permanently remove this item?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleItemDialogueClose}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Bulk Records Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to permanently remove these items?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={confirmDeleteBulk} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DataTable;
