import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faComment, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { fetchPostsFav } from '../store/posts';

const ChangeActivity = ({ status = true }) => {
    const token = Cookies.get("token");
    const { id } = useParams();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setAdded(status);
    }, [status]);

    const addFav = async () => {
        try {
            const response = await axios.patch(`/posts/${id}`,
                JSON.stringify({
                    status: 'inactive'
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setAdded(false);
        } catch (error) {
            console.log(error);
        }
    };

    const delFav = async () => {
        try {
            const response = await axios.patch(`/posts/${id}`,
                JSON.stringify({
                    status: 'active'
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setAdded(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div >
            {added && <button className="fav-buttons" onClick={addFav}>Make inactive</button>}
            {!added && <button className="fav-buttons" onClick={delFav}>Make active</button>}
        </div>
    )
}

export default ChangeActivity;