import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom"
import  Admin  from "../src/components/Admin/Admin"
import  AdminLogin  from "../src/components/AdminLogin/AdminLogin"
import ResetPass from './components/ResetPassword/ResetPass';
 
function App() {
  return (
    <Routes>
    <Route path="/Admin" element= {<Admin />}/>
    <Route path="/AdminLogin" element={<AdminLogin />}/>
    <Route path="/Reset" element={<ResetPass />}/>
  </Routes>
 );
}

export default App;