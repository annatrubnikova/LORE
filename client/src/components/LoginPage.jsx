import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [userName, setUserName] = useState('');
    const [passw, setPassw] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setIsValid(value.trim() !== '');
    };

    const submitEvent = async (error) => {
        error.preventDefault();


        try {
            const response = await axios.post(
                '/auth/login',
                JSON.stringify({ login: userName, password: passw }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.data.user) {
                Cookies.set('token', response.data.token, { expires: 1, secure: true });
                Cookies.set('id', response.data.user.id, { expires: 1, secure: true });
            } else {
                setErrMsg('Ответ не содержит ожидаемых данных');
            }
            if (response.data) {
                navigate('/posts');
            }
        } catch (error) {
            console.error('Ошибка ответа:', error.response.data);

            setErrMsg(error.response.data.error || 'Произошла ошибка');
        }
    }

    useEffect(() => {
        if (token) navigate('/posts');
    }, [token]);

    return (
        <div className="loginBlock shadowEffect">
            <h2>Login to your account</h2>
            <form className="loginForm" onSubmit={submitEvent}>
                <div className="input-container">
                    <input
                        id="user"
                        placeholder="login"
                        onChange={(e) => {
                            setUserName(e.target.value);
                            setErrMsg('');
                        }}
                        className={`rounded-input ${errMsg && errMsg !== 'Password is wrong.' ? 'invalid' : ''}`}
                        required></input>
                    <div className={`${errMsg && errMsg !== 'Password is wrong.' ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg && errMsg !== 'Password is wrong.' ? 'errorIsShown' : 'hidden'}`}>
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
                        required
                        className={`rounded-input ${errMsg ? 'invalid' : ''}`}
                        type="password"></input>
                    <div className="error-icon">!</div>
                    <div className={`error-tooltip ${errMsg ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>

                <button className="submitBtn">submit</button>
            </form>
            <a className="anotherBtnForAuth" href="/register">Create an account</a>
            <br />
            <a className="anotherBtnForAuth" href="/password-reset">Forgot password?</a>
        </div>
    )
}

export default LoginPage;