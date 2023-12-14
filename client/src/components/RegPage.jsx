import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RegPage = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const [userName, setUserName] = useState('');
    const [passw, setPassw] = useState('');
    const [confpass, setConfPass] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [message, setMessage] = useState('');


    const submitEvent = async (error) => {
        error.preventDefault();


        try {
            const response = await axios.post('/auth/register',
                JSON.stringify({
                    login: userName,
                    password: passw,
                    confirmPassword: confpass,
                    email: email,
                    fullname: fullname
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    useEffect(() => {
        if (token) navigate('/posts');
    }, [token]);

    return (
        <div className="loginBlock regBlock shadowEffect">
            <h2>Register your account</h2>
            <p style={{ color: "#BA73D9" }}>{message}</p>
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
                        pattern="^(?=.*[A-Za-z])(?=.*\d).{8,}$"
                        title="Password must contain at least one letter, one digit, and be at least 8 characters long."
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
                        pattern="^(?=.*[A-Za-z])(?=.*\d).{8,}$"
                        title="Password must contain at least one letter, one digit, and be at least 8 characters long."
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
                <button className="submitBtn submitRegBtn">submit</button>
            </form>
            <a className="anotherBtnForAuth" href="/login">Already have account</a>
        </div>
    )
}

export default RegPage;