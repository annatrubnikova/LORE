import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { fetchPostsByUser } from '../store/posts';
import Posts from './Posts';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserRole } from '../store/users';

const User = () => {
    const dispatch = useDispatch();
    let roleOfuser = useSelector((state) => state.users.role);
    const [admin, setAdmin] = useState(false);

    const [login, setLogin] = useState();
    const [avatar, setAvatar] = useState();
    const [rating, setRating] = useState();
    const [fullname, setFullname] = useState();
    const [role, setRole] = useState();
    const { id } = useParams();
    const idUs = Cookies.get('id');
    const token = Cookies.get('token');

    useEffect(() => {
        if (roleOfuser && roleOfuser.role == 'Admin') {
            setAdmin(true);
        }
    }, [roleOfuser]);

    useEffect(() => {
        const getUser = async () => {
            try {
                await dispatch(fetchUserRole(token));
                const response = await axios.get(`/users/${id}`);
                setLogin(response.data.user.login);
                setAvatar(response.data.user.avatar);
                setRating(response.data.user.rating);
                setFullname(response.data.user.full_name);
                setRole(response.data.user.role);
            }
            catch (error) {
                console.log(error);
            }
        }

        getUser();
    }, []);



    return (<>
        <div className="userBlock oneUserBlock shadowEffect">
            <div className="oneUserBtns">
                <img src={avatar && avatar !== 'undefined' ? `http://localhost:5000/avatars/${avatar}` : ''} className='users-ava' alt={`avatar of ${fullname}`} />
                {(idUs == id || admin) && <a href={`/users/change/${id}`}><button className="buttonWithIcon"> <FontAwesomeIcon icon={faPenToSquare} /></button></a>}
            </div>
            <div className="userInfo">
                <div className="userInfoInput">
                    <span className="userInfoLabel">login</span>
                    <span className="rounded-input userInfoText">{login}</span>
                </div>

                <div className="userInfoInput">
                    <span className="userInfoLabel">full name</span>
                    <span className="rounded-input userInfoText">{fullname}</span>
                </div>

                <div className="userInfoInput">
                    <span className="userInfoLabel">role</span>
                    <span className="rounded-input userInfoText">{role}</span>
                </div>

                <div className="userInfoInput">
                    <span className="userInfoLabel">user rating</span>
                    <span className="rounded-input userInfoText">{rating}</span>
                </div>
            </div>
        </div>
        <Posts user={id} />
    </>
    )
}

export default User;
