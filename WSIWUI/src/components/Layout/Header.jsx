import { Component } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import './header.css';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = ({ path }) => {
    let showLogout=false;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    if (pathname === "/home" || pathname === "/") 
        showLogout = false;
    else
        showLogout = true; 
    const logout = () =>{
        console.log("logout")
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('setupTime')
        navigate('/AdminLogin');
        //this.props.history.push('/AdminLogin');
    };
        return(
            <div className="headerBanner">
                <div className="headerText">What Should I Wear ?</div>
                {localStorage.getItem('jwtToken') && showLogout === true &&
                <div onClick={logout} className="logoutIcon"><LogoutIcon /></div>}
            </div>
        );
}
export default Header;