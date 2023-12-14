import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { fetchUserRole } from '../store/users';
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Users = () => {
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    let role = useSelector((state) => state.users.role);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            try {
                dispatch(fetchUserRole(token));
                const response = await axios.get('/users');
                setUsers(response.data.users)
            }
            catch (error) {
                console.log(error);
            }
        }

        getUsers();
    }, []);

    useEffect(() => {
        if (role && role.role == 'Admin') {
            setAdmin(true);
        }
    }, [role]);

    return (<>
        {admin && (
            <button className="buttonWithIcon">
                <a href={`/admin/user-create`}>
                    <FontAwesomeIcon icon={faSquarePlus} />
                </a>
            </button>
        )}
        <div className="users-div">
            {users ? users.map((user) => (
                <div key={user.id} className="userBlock shadowEffect">
                    <img src={user.avatar && user.avatar !== 'undefined' ? `http://localhost:5000/avatars/${user.avatar}` : ''} className='users-ava' alt={`avatar of ${user.full_name}`}></img>
                    <div className="userInfo">
                        <span className="userInfoFullname"><a href={`/users/${user.id}`}>{user.full_name}</a></span>
                        <div className="userInfoRating">
                            <span className="userInfoRatingLabel">user rating</span>
                            <span className="userInfoRatingNum"><a href={`/users/${user.id}`}>{user.rating}</a></span>
                        </div>
                    </div>
                </div>
            )) : <></>}
        </div>
    </>
    )
}

export default Users;
