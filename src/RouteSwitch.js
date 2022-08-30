import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

const RouteSwitch = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route
                    path=""
                    element={<Navigate to="/home" replace/>}
                />
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/home' element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default RouteSwitch;