import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { Context } from '../states/LoginContext';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/Banner.jsx';
import Settings from '../Pages/Settings.jsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);
    const [redirectTo, setRedirectTo] = useState(null);

    //Determine if token exists. If so, user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        //Dependency array to ensure only runs once
    }, [setIsLoggedIn]);

    const handleLogin = () => {
        setRedirectTo("/login");
        console.log("User logged in");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setRedirectTo(null);
        console.log("User logged out");
    };

    const handleNavigate = (route) => {
        setRedirectTo(route);
        console.log(`Navigating to ${route}`);
    };

    return (
        <BrowserRouter>
            {redirectTo && (
                <>
                    <Navigate to={redirectTo} replace />
                    {setRedirectTo(null)} {/* Reset redirectTo after navigating */}
                </>
            )}
            <Banner
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path ="/settings" element={<Settings />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;