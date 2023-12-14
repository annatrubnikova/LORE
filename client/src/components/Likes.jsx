import { useState, useEffect } from "react";
import axios from '../api/axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPoo } from "@fortawesome/free-solid-svg-icons";

const Likes = ({ postId, commentId }) => {
    const token = Cookies.get('token');
    const id = Cookies.get('id');
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setdislikesCount] = useState(0);
    let [userLiked, setUserLiked] = useState(false);
    let [userDisliked, setUserDisliked] = useState(false);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                let table, type;
                if (commentId == null) {
                    table = 'posts';
                    type = postId;
                }
                else {
                    table = 'comments';
                    type = commentId;
                }
                const response = await axios.get(`/${table}/${type}/like`);
                if (response.data.likes) {
                    const userLikes = response.data.likes.filter(like => like.author_id == id);
                    if (userLikes.length > 0) {
                        if (userLikes[0].type == 'like') setUserLiked(true);
                        else setUserDisliked(true);
                    }
                    setLikesCount(response.data.likes.filter(like => like.type === 'like').length);
                    setdislikesCount(response.data.likes.filter(like => like.type === 'dislike').length);
                }
            } catch (error) {
                console.error("error");
            }
        };

        fetchLikes();
    }, [postId, commentId]);

    const handleLike = async (likedis, error) => {
        error.preventDefault();
        try {
            if (!likedis && !userDisliked || likedis && !userLiked) {
                let table, type;
                if (commentId == null) {
                    table = 'posts';
                    type = postId;
                }
                else {
                    table = 'comments';
                    type = commentId;
                }
                const response = await axios.post(`/${table}/${type}/like`,
                    JSON.stringify({ like: likedis }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    });
                if (!likedis) {
                    setdislikesCount(dislikesCount + 1);
                    if (userLiked) setLikesCount(likesCount - 1);
                    setUserDisliked(true);
                    setUserLiked(false);
                }
                if (likedis) {
                    setLikesCount(likesCount + 1);
                    if (userDisliked) setdislikesCount(dislikesCount - 1);
                    setUserDisliked(false);
                    setUserLiked(true);
                }
            }
            else {
                let table, type;
                if (commentId == null) {
                    table = 'posts';
                    type = postId;
                }
                else {
                    table = 'comments';
                    type = commentId;
                }
                const response = await axios.delete(`/${table}/${type}/like`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true,
                        data: {
                            like: likedis
                        },
                    });
                if (!likedis) {
                    setdislikesCount(dislikesCount - 1);
                    setUserDisliked(false);
                }
                if (likedis) {
                    setLikesCount(likesCount - 1)
                    setUserLiked(false);
                }
            }
        } catch (error) {
            console.error("error");
        }
    }

    return (
        <div className="likesInfo">
            <div>
                <button className="buttonWithIcon" onClick={(e) => handleLike(true, e)}><FontAwesomeIcon style={{ color: 'rgb(255, 66, 129)' }} icon={faHeart} /></button>
                <span>{likesCount}</span>
            </div>
            <div>
                <button className="buttonWithIcon" onClick={(e) => handleLike(false, e)}><FontAwesomeIcon style={{ color: 'black' }} icon={faPoo} /></button>
                <span>{dislikesCount}</span>
            </div>
        </div>
    );
}

export default Likes;
