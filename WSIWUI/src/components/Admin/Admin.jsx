import { Component } from "react";
import './Admin.css';

class Admin extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          fields: {
            email:'',
            password:'',
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
        if(!fields["password"]){
            formIsValid = false;
            errors["password"] = "Please provide password";
            }
        this.setState({errors: errors});
        return formIsValid;
        }
      handleChange(field, e) {
        this.handleValidation();
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
      }
      handleSubmit(e){
        e.preventDefault();
        if(this.handleValidation()){
            alert(this.state.fields["email"]+ ' ' +this.state.fields["password"]);
        }else{
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
              <label className="lblAdminLogin" htmlFor="password">Password</label>
              <input 
              className="inpAdminLogin" 
              id="password" type="password" 
              value={this.state.fields["password"]}
              onChange={this.handleChange.bind(this, "password")}
              placeholder="Please enter password"/>
              {/* {form.errorsPass==true? ( */}
          <div className='errorDiv' id="errorsPass">
            {this.state.errors["password"]}
          </div>
         {/* ) : null} */}
            </div>
            <button className="btnSubmit" type="submit">Submit</button>
          </form>
        );
    }
}
export default Admin;