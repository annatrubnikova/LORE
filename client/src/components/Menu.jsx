import { useEffect, useState } from "react";
import axios from '../api/axios';
import { Outlet, useHistory, useLocation } from 'react-router-dom';
import Logout from "./Logout";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUserRole, getFetchStatus } from '../store/users';
import Login from "./Login";

const Menu = () => {
    const [ava, setAva] = useState();
    const [id, setId] = useState();
    const locationlink = useLocation();
    const location = window.location.href;
    const [isActiveCategory, setIsActiveCategory] = useState();
    const [isActivePosts, setIsActivePosts] = useState();
    const [isActiveUsers, setIsActiveUsers] = useState();
    const dispatch = useDispatch();
    let role = useSelector((state) => state.users.role);
    const [user, setUser] = useState(false);
    const [login, setLogin] = useState();
    const token = Cookies.get('token');


    useEffect(() => {
        if (user) {
            setId(user.id);
        } else {
            setId(null);
            setAva(null);
        }
    }, [user]);

    useEffect(() => {
        if (role) {
            setUser(true);
            setId(role.id);
            setLogin(role.login);
        }
    }, [role]);

    useEffect(() => {
        const getUserAva = async () => {
            try {
                dispatch(fetchUserRole(token));
                const response = await axios.get(`/users/${id}`);
                setAva(response.data.user.avatar);
            }
            catch (error) {
                console.log(error);
            }
        }

        getUserAva();

        ['categories', 'posts', 'users'].map(el => {
            switch (el) {
                case 'categories':
                    if (location.includes(el)) {
                        setIsActiveCategory(true);
                        setIsActivePosts(false);
                        setIsActiveUsers(false);
                        break;
                    }

                case 'posts':
                    if (location.includes(el)) {
                        setIsActivePosts(true);
                        setIsActiveCategory(false);
                        setIsActiveUsers(false);
                        break;
                    }

                case 'users':
                    if (location.includes(el)) {
                        setIsActiveUsers(true);
                        setIsActiveCategory(false);
                        setIsActivePosts(false);
                        break;
                    }
            }
        });
    }, [location.pathname, id, dispatch, token])


    const handleLogout = () => {
        setUser(false);
        setAva();
        setIsActiveCategory(false);
        setIsActivePosts(false);
        setIsActiveUsers(false);
    };

    return (
        <div className="menuBlock">
            <div className="headerBlock">
                <p className="appName">Lore</p>
                <div className="menuList">
                    <a className={isActiveCategory ? "menuListActive" : ""} href="/categories">CATEGORIES</a>
                    <a className={isActivePosts ? "menuListActive" : ""} href="/posts/?page=1">POSTS</a>
                    <a className={isActiveUsers ? "menuListActive" : ""} href="/users">USERS</a>
                </div>
                {token && token != 'undef' && <div className="menuButtonsUser">
                    <a className="login-menu" href={`/users/${id}`}>{login ? login : "     "}</a>
                    <a href={`/users/${id}`}><img className="shadowEffect" src={ava ? `http://localhost:5000/avatars/${ava}` : `http://localhost:5000/avatars/default.jpg`} /></a>
                    <Logout onLogout={handleLogout} />
                </div>}
                {!token && <Login />}

            </div>
            <main className="App">
                <Outlet />
            </main>
        </div>
    )
}

export default Menu;