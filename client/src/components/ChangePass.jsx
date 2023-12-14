import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChangePass = () => {
    let { token } = useParams();
    const [passw, setPassw] = useState('');
    const [passwConfirm, setPasswConfirm] = useState('');
    const [message, setErrMsg] = useState('');
    const tokenUs = Cookies.get('token');
    const navigate = useNavigate();
    if (tokenUs) navigate('/posts');


    const submitEvent = async (error) => {
        error.preventDefault();


        try {
            const response = await axios.post(
                `/auth/password-reset/${token}`,
                JSON.stringify({ password: passw, confirmPassword: passwConfirm }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            if (response.data.message) {
                navigate("/login");
            } else {
                setErrMsg(error);
            }
        } catch (error) {
            console.error('Ошибка ответа:', error.response.data);
            setErrMsg(error.response.data.error || 'Произошла ошибка');
        }
    }

    return (
        <div className="password-reset">
            <h2>Reset your password!</h2>
            <p>{message}</p>
            <form className="form-container" onSubmit={submitEvent}>
                <input
                    id="passw"
                    className="rounded-input"
                    onChange={(e) => setPassw(e.target.value)}
                    required
                    type="password"
                    placeholder="Your new password"></input>
                <br />
                <input
                    id="passwConfirm"
                    className="rounded-input"
                    onChange={(e) => setPasswConfirm(e.target.value)}
                    required
                    type="password"
                    placeholder="Confirm your new password"></input>
                <br />
                <button>submit</button>
            </form>
        </div>
    )
}

export default ChangePass;