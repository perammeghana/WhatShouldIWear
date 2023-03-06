import { Component } from "react";
import './ResetPass.css';
import bcrypt from 'bcryptjs';

class ResetPass extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          fields: {
            email:'',
            OldPassword:'',
            newPassword:'',
          },
          errors: {},
        };
      }
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        //Email
        if(!fields["email"]){
            formIsValid = false;
            errors["email"] = "Please provide username";
        }
        if(!fields["OldPassword"]){
            formIsValid = false;
            errors["OldPassword"] = "Please provide old password";
            }
        if(!fields["newPassword"]){
            formIsValid = false;
            errors["newPassword"] = "Please provide new password";
            }
        if(fields["OldPassword"] === fields["newPassword"]){
            formIsValid = false;
            errors["newPassword"] = "Old password and new password can't be same !";
        }
        this.setState({errors: errors});
        return formIsValid;
        }
      handleChange(field, e) {
        //this.handleValidation();
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
      }
      //On submitting the form
       async handleSubmit(e){
        e.preventDefault();
        if(this.handleValidation()){
            try {
                const response =  await fetch('http://localhost:4000/testAPI',{
                  method: 'POST',
                  body: JSON.stringify({
                    // Add parameters here
                    username : this.state.fields.email,
                    password : this.state.fields.OldPassword
                  }),
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },
                });
                const json =  await response.json();
                if(json.message == 'valid data'){
                    try {
                        const responseUpdate =  await fetch('http://localhost:4000/testAPI',{
                            method: 'PUT',
                            body: JSON.stringify({
                            // Add parameters here
                            username : this.state.fields.email,
                            oldpassword : this.state.fields.OldPassword,
                            newPassword: this.state.fields.newPassword
                            }),
                            headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            },
                        });
                        const jsonUpdate =  await responseUpdate.json();
                        if(jsonUpdate.message == 'updated'){
                            //redirect here
                            alert("success");
                        }
                        else{
                            let errors = {};
                            errors["newPassword"] = "Error! Please try again !";
                            this.setState({errors: errors});
                        }
                    } catch (error) {
                    console.log(error);
                    }
                }
                else{
                  let errors = {};
                  errors["password"] = "Incorrect credentials !!";
                  this.setState({errors: errors});
                }
              } catch (error) {
                console.log(error);
              }  
            }
        else{
          return
        }   
      }
    render(){
        return(
            <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="userDiv">
              <label className="lblAdminLogin" htmlFor="text">Username</label>
              <input 
              className="inpAdminLogin" 
              id="email" 
              type="text" 
              value={this.state.fields["email"]}
              onChange={this.handleChange.bind(this, "email")}
              placeholder="Please enter username"/>
              {/* {form.errorsEmail == true?( */}
          <div className='errorDiv' id="errorsEmail">
            {this.state.errors["email"]}
          </div>
        {/* ) : null} */}
            </div>
            <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">Old Password</label>
              <input 
              className="inpAdminLogin" 
              id="oldPassword" type="password" 
              value={this.state.fields["OldPassword"]}
              onChange={this.handleChange.bind(this, "OldPassword")}
              placeholder="Please enter password"/>
              {/* {form.errorsPass==true? ( */}
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["OldPassword"]}
          </div>
         {/* ) : null} */}
            </div>
            <div className="passDiv">
              <label className="lblAdminLogin" htmlFor="password">New Password</label>
              <input 
              className="inpAdminLogin" 
              id="newPassword" type="password" 
              value={this.state.fields["newPassword"]}
              onChange={this.handleChange.bind(this, "newPassword")}
              placeholder="Please enter password"/>
              {/* {form.errorsPass==true? ( */}
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["newPassword"]}
          </div>
         {/* ) : null} */}
            </div>
            <button className="btnSubmit" type="submit">Submit</button>
            <a href="/AdminLogin" className="btnReset">Back to Login</a>
          </form>
        );
    }
}
export default ResetPass;