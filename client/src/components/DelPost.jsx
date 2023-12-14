import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

const DelPost = ({ post }) => {
    const token = Cookies.get('token');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const handleDelete = async (error) => {
        error.preventDefault();

        try {
            const response = await axios.delete(
                `/posts/${post}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setErrMsg(response.data.message);

            if (response.data) {
                navigate('/posts');
            }
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    const handleConfirmDelete = (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete post?");
        if (confirmed) {
            handleDelete(e);
        }
    }

    return (
        <div>
            <p>{errMsg}</p>
            <button onClick={handleConfirmDelete}>Delete post</button>
        </div>
    );
}

export default DelPost;
