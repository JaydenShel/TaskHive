import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginState from '../Components/LoginState.jsx';
import HomePage from './Home.jsx';
import Login from './Login.jsx';
import Banner from '../Components/Banner.jsx';

function App() {
    // State to track whether the user is logged in or not
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    // Login functionality
    const handleLogin = () => {
        setIsLoggedIn(true);
        console.log("User logged in");
    };

    // Logout functionality
    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log("User logged out");
    };

    // Handle navigation (if you need this for the Banner)
    const handleNavigate = (route) => {
        // Here you can implement your navigation logic (e.g., using useNavigate() from react-router)
        console.log(`Navigating to ${route}`);
    };

    return (
        <LoginState>
            <BrowserRouter>
                {/* Banner added globally */}
                <Banner
                    isLoggedIn={isLoggedIn}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onNavigate={handleNavigate}
                    username={username}
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