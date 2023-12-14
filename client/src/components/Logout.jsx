import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Logout = ({ user }) => {
    const token = Cookies.get('token');
    const navigate = useNavigate();

    const HandleOut = async (error) => {
        error.preventDefault();
        Cookies.remove('token');
        Cookies.remove('id');
        try {
            const response = await axios.post(
                `/auth/logout`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            if (response.data.message) {
                navigate('/login');
            }
        } catch (error) {
            console.log(error.response.data.error)
        }
    }


    return (
        <button className="buttonWithIcon" onClick={HandleOut}><FontAwesomeIcon className="logoutIcon" icon={faRightFromBracket} /></button>
    );
}

export default Logout;
