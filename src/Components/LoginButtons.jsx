import { Link } from 'react-router-dom';

function LoginButtons(){
    return(
        <>
            <Link to={'/login'}>
                <button className="button">
                    <p>Log in</p>
                </button>
            </Link>
            <Link to={'/account'}>
                <button className="button">
                    <p>Create Account</p>
                </button>
            </Link>
        </>
    )

}

export default LoginButtons;