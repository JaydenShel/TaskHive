import React from 'react';
import PropTypes from 'prop-types';

function Banner({ isLoggedIn, username, onLogin, onLogout, onNavigate }) {
    return (
        <div className="banner">
            {/* Left: App Title */}
            <div className="banner-logo">
                <h1 className="banner-title">Synth</h1>
            </div>

            {/* Right: Navigation/Buttons */}
            <div className="banner-actions">
                {isLoggedIn ? (
                    <>
                        <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
                        <button onClick={() => onNavigate('settings')}>Settings</button>
                        <button onClick={onLogout} className="logout-button">
                            Logout
                        </button>
                        <div className="profile">{username}</div>
                    </>
                ) : (
                    <button onClick={onLogin} className="login-button">
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}

Banner.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
};

Banner.defaultProps = {
    username: '',
};

export default Banner;