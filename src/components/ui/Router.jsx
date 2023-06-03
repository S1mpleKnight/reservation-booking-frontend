import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../screens/home/Home"
import Login from "../screens/login/Login"
import Registration from "../screens/registration/Registration"
import Country from "../screens/country/Country"
import City from "../screens/city/City"
import Profile from "../screens/profile/Profile"

const Router = () => {
    return <BrowserRouter>
    <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<Login/>} path="/login"/>
        <Route element={<Registration/>} path="/registration"/>
        <Route element={<Home/>} path="/logout"/>
        <Route element={<Country/>} path="/countries"/>
        <Route element={<City/>} path="/cities"/>
        <Route element={<Profile/>} path="/profile"/>
        <Route element={<Home/>} path="*"/>
    </Routes>
    </BrowserRouter>
}

export default Router