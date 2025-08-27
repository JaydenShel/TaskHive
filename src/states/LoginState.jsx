import { useState } from 'react';
import PropTypes from 'prop-types';
import { Context } from './LoginContext.jsx';

const LoginState = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Context.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {children}
    </Context.Provider>
  );
};

// Declare children as a React node
LoginState.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginState;
