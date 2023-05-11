/* eslint-disable jsx-a11y/img-redundant-alt */
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
  Typography
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
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function DataTable({ tableData, clothCategory, fetchRecord }) {
  const [error,setError]= useState()
  const [openAlert, setOpenAlert] = React.useState(false);
  const [toastMessge, setToastMessge] = useState();
  const [open, setOpen] = useState(false);
  const [openItemDialogue, setOpenItemDialogue] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const [updateRecordModal, setUpdateRecordModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [data, setData] = useState(tableData);
  const [activeIndex, setActiveIndex] = useState();
  const [updateAbleId, setUpdateAbleId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");


  const [values, setValues] = React.useState({
    clothing_category_id: null,
    clothingName: "",
    image: ""
  
  });
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const handleImageUpload = (event, id) => {
    setImage(event.target.files[0]);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(prop)
    console.log(values)
  };

  const handleSubmit = async () => {

    if(values.clothingName==="" || values.clothing_category_id===""){
      setError("Please provide all data to continue")
      return 
    }
    const formData = new FormData();
    if(file){

      formData.append("image", file);
    }
    else{
      setError("Clothing Image cannot be empty")
      return  
    }
    formData.append("clothing_type", values.clothingName);
    //formData.append("clothing_category_id", values.categoryName);
    formData.append("clothing_category_id", values.clothing_category_id);

    await fetch("https://api.mikebelus.net/clothAPI/addClothing", {
      method: "POST",
      body: formData,
      headers: {
   
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
      clothing_category_id: "",
      clothingName: "",
      image: ""
    });
    setFile()
    setFileName("")
    setError()
  };
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
      name: "categoryName",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },
    {
      label: "Clothing Name",
      name: "clothingName",
      // options: {
      //   filter: true,
      //   sort: false,
      // },
    },
    {
      label: "Image",
      name: "image",
      options: {
        filter: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box
              sx={{
                display: "flex",
              }}
            >
            
             <img src={data[dataIndex].image} alt='' width={80} height={80} />
            </Box>
          );
        },
      },
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
    selectableRowsHeader: false,
    selectableRows: "none",
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
    setError()
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleItemDialogueClose = () => {
    setOpenItemDialogue(false);
    setError()
  };
  const confirmDelete = () => {
    fetch(`https://api.mikebelus.net/clothAPI/deleteClothing/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    }).then(async (res) => {
      if(res.status ===200){
    const filteredDataArray = data.filter((item) => item.id !== itemId);
    setData(filteredDataArray);
    setOpenAlert(true);
    setToastMessge("Deleted Successfully!");
    setOpenItemDialogue(false);
  }
  else{
    const response= await res.json()
    // setOpenAlert(true);
    // setToastMessge();
    setError(response.message)
  }
});
  };
  const confirmDeleteBulk = () => {
    setOpenAlert(true);
    const filteredDataArray = data.filter(
      (item) => !selectedRows.includes(item.id)
    );
    setData(filteredDataArray);
    setToastMessge("Deleted Successfully!");
    setOpen(false);
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
    console.log()
    setValues(data[id]);
    setImage(data[id].image);
    setUpdateRecordModal(true);
  };
  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if(file){

      formData.append("image", file);
    }
    formData.append("clothing_id", updateAbleId);
    formData.append("clothing_type", values.clothingName);
    //formData.append("clothing_category_id", values.clothing_category_id);
    formData.append("clothing_category_id", values.clothing_category_id);
    await fetch("https://api.mikebelus.net/clothAPI/editClothing", {
      method: "PUT",
      body: formData,
      headers: {
       
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    });
    fetchRecord();
    setUpdateRecordModal(false);
    setValues({
      clothing_category_id: "",
      clothingName: "",
      image: ""
    });
    setFile()
    setFileName("")
  };

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
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
      />
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
              <InputLabel htmlFor="outlined-adornment-categoryName">
                Category Name
              </InputLabel>
              <Select
                labelId="outlined-adornment-categoryName"
                d="outlined-adornment-categoryName"
                value={values.categoryName}
                label="Category Name"
                onChange={handleChange("clothing_category_id")}
                sx={{
                  width: "100%",
                }}
              >
                {clothCategory?.map((item, index) => {
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
              <InputLabel htmlFor="outlined-adornment-clothingName">
                Clothing Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-clothingName"
                value={values.clothingName}
                onChange={handleChange("clothingName")}
                label="Clothing Name"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
          <input type="file" onChange={saveFile} />
       
          </Grid>
          <Grid item xs={12}>

        <div className='errorDiv' id="errorsPass">
                    {error ? error : null }
                  </div>
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={() => {setRecordModal(false); setError()}}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Update  Record Popup */}
      <Dialog
        open={updateRecordModal}
        onClose={() =>{
          setUpdateRecordModal(false)
          setFile()
          setFileName("")
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Record"}</DialogTitle>
        <Grid container spacing={2} px="20px">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ marginBottom: "10px" }}>
              <InputLabel htmlFor="outlined-adornment-categoryName">
                Category Name
              </InputLabel>
              <Select
                labelId="outlined-adornment-categoryName"
                d="outlined-adornment-categoryName"
                value={values.clothing_category_id}
                label="Category Name"
                onChange={handleChange("clothing_category_id")}
                sx={{
                  width: "100%",
                }}
              >
                {clothCategory?.map((item, index) => {
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
              <InputLabel htmlFor="outlined-adornment-clothingName">
                Clothing Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-clothingName"
                value={values.clothingName}
                onChange={handleChange("clothingName")}
                label="Clothing Name"
                sx={{
                  width: "100%",
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
          <input type="file" onChange={saveFile} />
          {!file && values.image && <Typography>
            {values.image?.replace("https://api.mikebelus.net/images/","")}
            </Typography>}
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={() => {setUpdateRecordModal(false) 
            setFile();
            setFileName("")}}>Cancel</Button>
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
       <div className='errorDiv' id="errorsPass">
                    {error ? error : null }
                  </div>
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