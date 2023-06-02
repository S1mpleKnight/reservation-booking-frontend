import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../screens/home/Home"
import Login from "../screens/login/Login"
import Registration from "../screens/registration/Registration"
import Country from "../screens/country/Country"

const Router = () => {
    return <BrowserRouter>
    <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<Login/>} path="/login"/>
        <Route element={<Registration/>} path="/registration"/>
        <Route element={<Home/>} path="/logout"/>
        <Route element={<Country/>} path="/countries"/>
        <Route element={<City/>} path="/cities"/>
        <Route element={<Home/>} path="*"/>
    </Routes>
    </BrowserRouter>
}

export default Router