//import { Component } from "react";
import * as React from 'react';
import './AdminLogin.css'
const INITIAL_STATE = {
    email: '',
    password: '',
    errorsEmail : false,
    errorsPass : false
  };
  
  const VALIDATION = {
    email: [
      {
        isValid: (value) => !!value,
        message: 'Username is required',
      }
    ],
    password: [
      {
        isValid: (value) => !!value,
        message: 'Password is required.',
      },
    ],
  };
  
  const getErrorFields = (form) =>
    Object.keys(form).reduce((acc, key) => {
      if (!VALIDATION[key]) return acc;
  
      const errorsPerField = VALIDATION[key]
        // get a list of potential errors for each field
        // by running through all the checks
        .map((validation) => ({
          isValid: validation.isValid(form[key]),
          message: validation.message,
        }))
        // only keep the errors
        .filter((errorPerField) => !errorPerField.isValid);
  
      return { ...acc, [key]: errorsPerField };
    }, {});
function AdminLogin (){
    //render(){
          const [form, setForm] = React.useState(INITIAL_STATE);
          const errorFields = getErrorFields(form);
            console.log(errorFields);
        const handleChange = (event) => {
            setForm({
              ...form,
              [event.target.id]: event.target.value,
            });
          };
        //   let hasErrors = false;
        //   let errorsEmail = false;
        //   let errorsPass = false;
          const handleSubmit = (event) => {
            event.preventDefault();
            const hasErrors = Object.values(errorFields).flat().length > 0;
            if(hasErrors && (errorFields.email.length)){
                console.log(errorFields.email.length+"email")
                setForm({
                    ...form,
                    errorsEmail:true
                })
                //this.INITIAL_STATE.errorsEmail=true
            }           
            if(hasErrors && (errorFields.password.length)){
                console.log(errorFields.password.length+"password")
                setForm({
                    ...form,
                    errorsPass:true
                })
                //this.INITIAL_STATE.errorsPass=true
            }
            if (hasErrors) return;
            alert(form.email + ' ' + form.password);
          };
        return(
            // <div className="adminLoginDiv">
        <form onSubmit={handleSubmit}>
            <div className="userDiv">
              <label className="lblAdminLogin" htmlFor="text">Username</label>
              <input 
              className="inpAdminLogin" 
              id="email" 
              type="text" 
              value={form.email}
              onChange={handleChange}
              placeholder="Please enter username"/>
              {form.errorsEmail == true?(
          <div className='errorDiv' id="errorsEmail">
            {errorFields.email[0].message}
          </div>
        ) : null}
            </div>
            <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">Password</label>
              <input 
              className="inpAdminLogin" 
              id="password" type="password" 
              value={form.password}
              onChange={handleChange}
              placeholder="Please enter password"/>
              {form.errorsPass==true? (
          <div className='errorDiv' id="errorsPass">
            {errorFields.password[0].message}
          </div>
        ) : null}
            </div>
            <button className="btnSubmit" type="submit">Submit</button>
          </form>
        //   </div>
        );
    //}
}
export default AdminLogin;