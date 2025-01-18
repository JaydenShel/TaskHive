import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { Context } from '../states/LoginContext';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/Banner.jsx';
import Settings from '../Pages/Settings.jsx';
import Account from '../Pages/Account.jsx';
import Collections from "./Collections.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);
    const [redirectTo, setRedirectTo] = useState(null);

    //Periodically retrieve cookie and verify token
    useEffect(() => {
        //If user is logged in verify token
        verifyToken()
            .then()
        const interval = setInterval(verifyToken, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [setIsLoggedIn]);

    const handleLogin = () => {
        setRedirectTo("/login");
        console.log("User logged in");
    };

    const handleLogout = async () => {
        await fetch("http://localhost:3000/logout/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })

        setIsLoggedIn(false);
        setRedirectTo(null);
        
        console.log("User logged out");
    };

    const handleNavigate = (route) => {
        setRedirectTo(route);
        console.log(`Navigating to ${route}`);
    };

    const handleAccount = () => {
        setRedirectTo("/account");
        console.log("Account creation");
    }

    const verifyToken = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log("Verification Success")
                setIsLoggedIn(true); //Token is valid
            } else {
                setIsLoggedIn(false); //Token is invalid or expired
            }
        } catch (error) {
            console.error("Token verification failed:", error);
            setIsLoggedIn(false); //If there's an error, log out the user
        }
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
                onAccount={handleAccount}
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account/>} />
                <Route path ="/settings" element={<Settings />}/>
                <Route path="/collections" element={<Collections/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;