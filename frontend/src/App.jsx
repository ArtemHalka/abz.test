import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import './App.css';
import AllUsers from './AllUsers';
import CreateUser from './CreateUser';
import UserInfo from './UserInfo';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <NavLink to={'/'}>All users</NavLink>
                <NavLink to={'/create-user'}>Create user</NavLink>
            </nav>
            <div className="App">
                <Routes>
                    <Route path="/" element={<AllUsers />} />
                    <Route path="/user/:id" element={<UserInfo />} />
                    <Route path="/create-user" element={<CreateUser />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
