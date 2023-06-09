import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../screens/login/Login"
import Registration from "../screens/registration/Registration"
import Country from "../screens/country/Country"
import City from "../screens/city/City"
import Profile from "../screens/profile/Profile"
import Category from "../screens/category/Category"
import Password from "../screens/profile/Password"
import Establishment from "../screens/establishment/Establishment"
import Event from "../screens/event/Event"
import { Navigate } from "react-router-dom"
import Offer from "../screens/offer/Offer"
import ExactOffer from "../screens/offer/ExactOffer"
import Reservation from "../screens/reservations/Reservation"

const Router = () => {
    return <BrowserRouter>
    <Routes>
        <Route element={<Offer/>} path="/"/>
        <Route element={<Login/>} path="/login"/>
        <Route element={<Registration/>} path="/registration"/>
        <Route element={<Offer/>} path="/logout"/>
        <Route element={<Country/>} path="/countries"/>
        <Route element={<City/>} path="/cities"/>
        <Route element={<Profile/>} path="/profile"/>
        <Route element={<Password/>} path="/profile/password"/>
        <Route element={<Category/>} path="/categories"/>
        <Route element={<Establishment/>} path="/establishments"/>
        <Route element={<Event/>} path="/events"/>
        <Route element={<Offer/>} path="/offers"/>
        <Route element={<ExactOffer/>} path="/offers/:id"/>
        <Route element={<Reservation/>} path="/reservations"/>
        <Route element={<Navigate to="/" replace/>} path="*"/>
    </Routes>
    </BrowserRouter>
}

export default Router