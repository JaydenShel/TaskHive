import { useState } from 'react';
import { Context } from './LoginContext.jsx'; // Import the context

// eslint-disable-next-line react/prop-types
const LoginState = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Context.Provider value={[isLoggedIn, setIsLoggedIn]}>
            {children}
        </Context.Provider>
    );
};

export default LoginState;