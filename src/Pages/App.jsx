import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginState from '../Components/LoginState.jsx';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/Banner.jsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);

    const handleLogin = () => {
        setIsLoggedIn(true);
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
        <LoginState>
            <BrowserRouter>
                {redirectTo && (
                    <>
                        <Navigate to={redirectTo} replace />
                        {setRedirectTo(null)}
                    </>
                )}
                <Banner
                    isLoggedIn={isLoggedIn}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                    username={isLoggedIn ? "Username" : ""}
                />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </LoginState>
    );
}

export default App;