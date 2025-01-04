import PropTypes from 'prop-types';
import '../Style/s_banner.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Banner({ isLoggedIn = '', onLogin, onLogout, onAccount }) {  // Set default value for username
    const navigate = useNavigate();
    const location = useLocation();

    //Check if the current page is the login page
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="banner">
            {/* Left: App Title */}
            <div className="banner-logo">
                <h1 className="banner-title">Synth</h1>
            </div>

            {/* Right: Navigation/Buttons */}
            <div className="banner-actions">
                {!isLoginPage && isLoggedIn ? (
                    <>
                        {/* Use Link for navigation */}
                        <Link to="/dashboard">
                            <button>Dashboard</button>
                        </Link>
                        <Link to="/settings">
                            <button>Settings</button>
                        </Link>
                        <button onClick={onLogout} className="logout-button">
                            Logout
                        </button>
                        <div className="profile">{localStorage.getItem('username')}</div>
                    </>
                ) : !isLoginPage ? (
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
                            onClick={() =>{
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
};

export default Banner;