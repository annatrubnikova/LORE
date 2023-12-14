import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserCreate = () => {
    const [userName, setUserName] = useState('');
    const [passw, setPassw] = useState('');
    const [confpass, setConfPass] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('User');
    const [errMsg, setErrMsg] = useState('');
    const token = Cookies.get('token');
    const navigate = useNavigate();


    const submitEvent = async (error) => {
        error.preventDefault();
        try {
            const response = await axios.post('/users',
                JSON.stringify({
                    login: userName,
                    password: passw,
                    confirmPassword: confpass,
                    email: email,
                    fullname: fullname,
                    role: role
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            if (response.data.user) {
                navigate(`/users`);
            }
            setErrMsg(response.data.message);

        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    return (
        <div className="loginBlock regBlock shadowEffect">
            <h2>Register new account</h2>
            <form className="loginForm" onSubmit={submitEvent}>
                <div className="input-container">
                    <input
                        id="user"
                        placeholder="login"
                        onChange={(e) => {
                            setUserName(e.target.value);
                            setErrMsg('');
                        }}
                        className={`rounded-input ${errMsg && errMsg === 'Login or email already exists' ? 'invalid' : ''}`}
                        required></input>
                    <div className={`${errMsg && errMsg === 'Login or email already exists' ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg && errMsg === 'Login or email already exists' ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>

                <div className="input-container">
                    <input
                        id="pass"
                        placeholder="password"
                        onChange={(e) => {
                            setPassw(e.target.value);
                            setErrMsg('');
                        }}
                        className={`rounded-input ${errMsg && errMsg === "Passwords don't match" ? 'invalid' : ''}`}
                        required
                        type="password"></input>
                    <div className={`${errMsg && errMsg === "Passwords don't match" ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg && errMsg === "Passwords don't match" ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>

                <div className="input-container">
                    <input
                        id="confpass"
                        placeholder="confirm password"
                        onChange={(e) => {
                            setConfPass(e.target.value);
                            setErrMsg('');
                        }}
                        className={`rounded-input ${errMsg && errMsg === "Passwords don't match" ? 'invalid' : ''}`}
                        required
                        type="password"></input>
                    <div className={`${errMsg && errMsg === "Passwords don't match" ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg && errMsg === "Passwords don't match" ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>

                <div className="input-container">
                    <input
                        id="email"
                        placeholder="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrMsg('');
                        }}
                        className={`rounded-input ${errMsg && (errMsg === 'Login or email already exists' || errMsg === 'Invalid email format') ? 'invalid' : ''}`}
                        required
                        type="email"></input>
                    <div className={`${errMsg && (errMsg === "Login or email already exists" || errMsg === 'Invalid email format') ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg && (errMsg === "Login or email already exists" || errMsg === 'Invalid email format') ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>

                <div className="input-container">
                    <input
                        id="fullname"
                        placeholder="fullname"
                        onChange={(e) => setFullname(e.target.value)}
                        className="rounded-input"
                        required
                        type="text"></input>
                </div>
                <select id="role"
                    onChange={(e) => setRole(e.target.value)}
                    required
                    value={role}>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
                <button className="submitBtn submitRegBtn">submit</button>
            </form>
        </div>
    )
}

export default UserCreate;
