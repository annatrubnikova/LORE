import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import AvatarChange from './AvatarChange';
import DelUser from './DelUser';
import { fetchUserById } from '../store/users';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import { fetchUserRole } from '../store/users';


const UserChange = () => {
    const dispatch = useDispatch();
    let roleUs = useSelector((state) => state.users.role);

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [checkLog, setLoginCheck] = useState('');
    const [admin, setAdmin] = useState(false);
    const [checkEma, setEmailCheck] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');
    const [avatar, setAvatar] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { id } = useParams();
    const token = Cookies.get('token');
    const idUs = Cookies.get('id');
    const navigate = useNavigate();

    useEffect(() => {
        if (roleUs && roleUs.role == 'Admin') {
            setAdmin(true);
        }
        else if (roleUs && roleUs.role == 'User') {
            if (id != idUs) navigate('/posts');
        }
    }, [roleUs]);


    useEffect(() => {
        const getUser = async () => {
            try {
                await dispatch(fetchUserRole(token));
                const response = await axios.get(`/users/${id}`);
                setLogin(response.data.user.login);
                setEmail(response.data.user.email);
                setLoginCheck(response.data.user.login);
                setEmailCheck(response.data.user.email);
                setFullname(response.data.user.full_name);
                setRole(response.data.user.role);
                setAvatar(response.data.user.avatar);

            }
            catch (error) {
                console.log(error);
            }
        }

        getUser();
    }, []);

    const submitEvent = async (error) => {
        error.preventDefault();
        let userToChange = {
            fullname: fullname,
            role: role
        }
        if (login !== checkLog) userToChange = {
            ...userToChange,
            login: login
        }
        if (email !== checkEma) userToChange = {
            ...userToChange,
            email: email
        }

        try {
            const response = await axios.patch(
                `/users/${id}`,
                userToChange,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setErrMsg(response.data.message);
            navigate(`/users/${id}`);
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    return (
        <div>
            <p style={{ color: "#BA73D9", fontSize: "20px" }}>Login: {login}</p>
            {avatar && <AvatarChange avatarOld={avatar} id={id} />}
            <div className="loginBlock regBlock shadowEffect">
                <h2>Settings</h2>
                <form className="loginForm" onSubmit={submitEvent}>
                    <div className="input-container">
                        <input
                            id="user"
                            placeholder="login"
                            onChange={(e) => {
                                setLogin(e.target.value);
                                setErrMsg('');
                            }}
                            className={`rounded-input ${errMsg && errMsg === 'Login or email already exists' ? 'invalid' : ''}`}
                            required
                            value={login}></input>
                        <div className={`${errMsg && errMsg === 'Login or email already exists' ? 'error-icon' : 'hidden'}`}>!</div>
                        <div className={`error-tooltip ${errMsg && errMsg === 'Login or email already exists' ? 'errorIsShown' : 'hidden'}`}>
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
                            value={email}
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
                            value={fullname}
                            type="text"></input>
                    </div>
                    {admin ? <select id="role"
                        onChange={(e) => setRole(e.target.value)}
                        required
                        value={role}>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select> : null}
                    <button className="submitBtn submitRegBtn">submit</button>
                    <DelUser user={id} />
                </form>
            </div>
        </div>
    )
}

export default UserChange;