import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

const DelUser = ({ user }) => {
    const token = Cookies.get('token');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const handleDelete = async (error) => {
        error.preventDefault();

        try {
            const response = await axios.delete(
                `/users/${user}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            Cookies.set('token', response.data.token, { expires: 1, secure: true });
            Cookies.remove('id');
            setErrMsg(response.data.message);

            if (response.data) {
                navigate('/login');
            }
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    const handleConfirmDelete = (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete user?");
        if (confirmed) {
            handleDelete(e);
        }
    }

    return (
        <div>
            <p>{errMsg}</p>
            <button onClick={handleConfirmDelete}>Delete user</button>
        </div>
    );
}

export default DelUser;
