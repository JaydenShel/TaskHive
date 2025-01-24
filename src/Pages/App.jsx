import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Context } from '../states/LoginContext';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/Banner.jsx';
import Settings from './Profile_Options/Settings.jsx';
import Account from '../Pages/Account.jsx';
import Collections from "./Collections.jsx";
import Profile from './Profile.jsx'
import Reset from './reset.jsx'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);

    //Periodically retrieve cookie and verify token
    useEffect(() => {
        //If user is logged in verify token
        verifyToken()
            .then()
        const interval = setInterval(verifyToken, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [setIsLoggedIn]);

    const handleLogin = () => {
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
        
        console.log("User logged out");
    };

    const handleNavigate = (route) => {
        console.log(`Navigating to ${route}`);
    };

    const handleAccount = () => {
        console.log("Account creation");
    }

    const handleProfile = () =>{
        console.log("Profile Selected")
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
            <div>
                <Banner
                    isLoggedIn={isLoggedIn}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                    onAccount={handleAccount}
                    onProfile={handleProfile}
                />
            </div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account/>} />
                <Route path ="/settings" element={<Settings />}/>
                <Route path="/collections" element={<Collections/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/reset" element={<Reset/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;