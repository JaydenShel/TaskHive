import PropTypes from 'prop-types';
import '../Style/s_banner.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Banner({ isLoggedIn, username = '', onLogin, onLogout }) {  // Set default value for username
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the current page is the login page
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
                        <div className="profile">{username}</div>
                    </>
                ) : !isLoginPage ? (
                    <button
                        onClick={() => {
                            onLogin();
                            navigate('/login');
                        }}
                        className="login-button"
                    >
                        Login
                    </button>
                ) : null}
            </div>
        </div>
    );
}

Banner.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};

export default Banner;