import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faComment, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { fetchPostsFav } from '../store/posts';
import { useSelector, useDispatch } from 'react-redux';

const FavAddDel = () => {
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const { id } = useParams();
    let favour = useSelector((state) => state.posts.fav);
    const [added, setAdded] = useState(false);

    useEffect(() => {

        const getPostsCat = async () => {
            try {
                await dispatch(fetchPostsFav({ token: token }));
            }
            catch (error) {
                console.log(error);
            }
        }
        getPostsCat();
    }, []);

    useEffect(() => {
        if (favour.favorites) {
            let exist = favour.favorites.some(item => item.id == id);
            if (exist) setAdded(true)
        }
    }, [favour]);

    const addFav = async () => {
        try {
            const response = await axios.post('/fav',
                JSON.stringify({
                    post_id: id
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setAdded(true)
        } catch (error) {
            console.log(error);
        }
    };

    const delFav = async () => {
        try {
            const response = await axios.delete(`/fav/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setAdded(false)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div >
            {!added && <button className="fav-buttons" onClick={addFav}>Add to favourites</button>}
            {added && <button className="fav-buttons" onClick={delFav}>Delete from favourites</button>}
        </div>
    )
}

export default FavAddDel;