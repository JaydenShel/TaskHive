import { useState } from 'react';
import { Context } from './LoginContext.jsx'; // Import the context

const LoginState = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Context.Provider value={[isLoggedIn, setIsLoggedIn]}>
            {children}
        </Context.Provider>
    );
};

export default LoginState;