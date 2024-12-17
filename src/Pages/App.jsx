import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginState from '../Components/LoginState.jsx';
import Home from './Home.jsx';

function App() {

    return(
        <LoginState>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </LoginState>
    );

}
export default App;