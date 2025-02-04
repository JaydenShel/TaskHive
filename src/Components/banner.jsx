import PropTypes from 'prop-types';
import '../Style/s_banner.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Banner({ isLoggedIn = '', onLogin, onLogout, onAccount, onProfile}) {  // Set default value for username
    const navigate = useNavigate();
    const location = useLocation();

    //Check if the current page is the login page
    const isLoginPage = location.pathname === '/login';
    const isAccountPage = location.pathname === '/account';

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
                        <Link to="/collections">
                            <button>Collections</button>
                        </Link>
                        <Link to="/settings">
                            <button>Settings</button>
                        </Link>
                        <button onClick={() => {
                            navigate('/home')
                            onLogout()
                        }} className="logout-button">
                            Logout
                        </button>
                        <div className={"profile-container"} onClick={() => {
                            onProfile()
                            navigate('/profile')
                        }}>
                            <div className={"profile-logo"}>
                                <img
                                    src="/path/to/default-user-logo.png"
                                    alt="User Logo"
                                />
                            </div>
                            <div className="username">{localStorage.getItem('username')}</div>
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
    onProfile: PropTypes.func.isRequired,
};

export default Banner;