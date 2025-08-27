import PropTypes from 'prop-types';
import '../Style/s_banner.css';
import logo from '../img/TaskHiveLogo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useEffect, useState} from "react";
import { loadProfileImage } from "../Pages/utils/loadProfileImage";

function Banner({ isLoggedIn = '', onLogin, onLogout, onAccount, onProfile}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [hasImage, setHasImage] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");

    //Check if the current page is the login page
    const isLoginPage = location.pathname === '/login';
    const isAccountPage = location.pathname === '/account';

    useEffect(() => {
        async function fetchProfileImage() {
            const result = await loadProfileImage();
            if (result.success) {
                setProfileUrl(result.imageUrl);
                setHasImage(true);
            } else {
                setHasImage(false);
            }
        }

        fetchProfileImage();
    }, []);

    return (
        <div className="banner">
            {/* Left side - Logo and Title */}
            <div className="banner-left">
                <img 
                    className="image-logo" 
                    src={logo} 
                    alt="TaskHive Logo" 
                    onClick={() => navigate('/home')}
                />
                <div className="banner-logo">
                    <h1>TaskHive</h1>
                </div>
            </div>

            {/* Right side - Navigation and Profile */}
            <div className="banner-right">
                {!isLoginPage && isLoggedIn ? (
                    <>
                        <Link to="/collections">
                            <button>Collections</button>
                        </Link>
                        <Link to="/settings">
                            <button>Settings</button>
                        </Link>
                        <button 
                            onClick={() => {
                                navigate('/home')
                                onLogout()
                            }} 
                            className="logout-button"
                        >
                            Logout
                        </button>
                        <div 
                            className="profile-container" 
                            onClick={() => {
                                onProfile()
                                navigate('/profile')
                            }}
                        >
                            <div className="profile-logo">
                                {hasImage && profileUrl ? (
                                    <img src={profileUrl} alt="Profile" />
                                ) : (
                                    <div className="profile-placeholder">?</div>
                                )}
                            </div>
                            <div className="username">
                                {localStorage.getItem('username')}
                            </div>
                        </div>
                    </>
                ) : !isLoginPage && !isAccountPage ? (
                    <>
                        <button
                            onClick={() => {
                                onLogin();
                                navigate('/login');
                            }}
                            className="login-button"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                onAccount();
                                navigate('/account');
                            }}
                        >
                            Sign Up
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
}

Banner.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onAccount: PropTypes.func.isRequired,
    onProfile: PropTypes.func.isRequired,
};

export default Banner;