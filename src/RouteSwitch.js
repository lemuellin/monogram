import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const RouteSwitch = () => {
    return(
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/home' element={<HomePage/>}/>
            </Routes>
        </HashRouter>
    );
};

export default RouteSwitch;