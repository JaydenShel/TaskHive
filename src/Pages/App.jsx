import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { useContext, useEffect, useCallback } from 'react';
import { Context } from '../states/LoginContext';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/banner.jsx';
import Settings from './Profile_Options/Settings.jsx';
import Account from '../Pages/Account.jsx';
import Collections from "./Collections.jsx";
import Profile from './Profile.jsx'
import Reset from './reset.jsx'
import CreateB from "./create-b.jsx";
import Board from "./board";
import {API_BASE_URL} from "../config";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useContext(Context);

    const verifyToken = useCallback(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          setIsLoggedIn(response.status === 200);
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsLoggedIn(false);
        }
      }, [setIsLoggedIn]);
    
      useEffect(() => {
        verifyToken();
        const interval = setInterval(verifyToken, 5 * 60 * 1000);
        return () => clearInterval(interval);
      }, [verifyToken]);
    

    const handleLogin = () => {
        console.log("User logged in");
    };

    const handleLogout = async () => {
        await fetch(`${API_BASE_URL}/logout/`, {
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
                <Route path="/create-b" element={<CreateB/>}/>
                <Route path="/board/:boardId" element={<Board/>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;