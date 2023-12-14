import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PassReset = () => {
    const [email, setEmail] = useState('');
    const [message, setErrMsg] = useState('');
    const token = Cookies.get('token');
    const navigate = useNavigate();
    if (token) navigate('/posts');

    const submitEvent = async (error) => {
        error.preventDefault();


        try {
            const response = await axios.post(
                '/auth/password-reset',
                JSON.stringify({ email: email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.data.message) {
                const message = response.data.message;
                setErrMsg(message);
            } else {
                setErrMsg(response.data.error);
            }
        } catch (error) {
            console.error('Ошибка ответа:', error.response.data);

            setErrMsg(error.response.data.error || 'Произошла ошибка');
        }
    }

    return (
        <div className="password-reset">
            <h2>Password reset</h2>
            <p>{message}</p>
            <form className="form-container" onSubmit={submitEvent}>

                <input
                    type="email"
                    className="rounded-input"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your registered email"></input>
                <br />
                <button className="pass-button">submit</button>
            </form>
        </div>
    )
}

export default PassReset;