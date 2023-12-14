import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Likes from './Likes';
import Comments from './Comments';
import PostCategories from './PostCategories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faComment, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import FavAddDel from "./FavAddDel";
import ChangeActivity from "./ChangeActivity";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserRole } from '../store/users';

const Post = () => {
    const dispatch = useDispatch();
    const [author, setAuthor] = useState();
    const [authorAvatar, setAuthorAvatar] = useState();
    const [authorId, setAuthorId] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [postImage, setPostImage] = useState();
    const [status, setStatus] = useState();
    const [publishDate, setPublishDate] = useState();
    const { id } = useParams();
    const [admin, setAdmin] = useState(false);
    const token = Cookies.get('token');
    let role = useSelector((state) => state.users.role);


    useEffect(() => {
        if (role && role.role == 'Admin') {
            setAdmin(true);
        }
    }, [role]);

    useEffect(() => {
        const getPostsCat = async () => {
            try {
                const response = await axios.get(`/posts/${id}`);
                const author = await axios.get(`/users/${response.data.post.author_id}`);
                dispatch(fetchUserRole(token));
                setAuthorId(response.data.post.author_id);
                setAuthorAvatar(author.data.user.avatar);
                setAuthor(author.data.user.full_name)
                setTitle(response.data.post.title);
                setContent(response.data.post.content);
                setPostImage(response.data.post.image);
                setPublishDate(response.data.post.publishDate);
                setStatus(response.data.post.status);
            }
            catch (error) {
                console.log(error);
            }
        }
        getPostsCat();
    }, [dispatch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };

        return date.toLocaleString('en-US', options);
    };

    return (
        <div className="postBlock onePostBlock shadowEffect">
            <div className='postAuthorHeader'>
                <div className="postAuthorAvaAndName">
                    <img src={authorAvatar && authorAvatar !== 'undefined' ? `http://localhost:5000/avatars/${authorAvatar}` : <></>} alt={'author avatar'} />
                    <a href={`/users/${authorId}`} className="post-author">{author}</a>
                </div>

                <span className='postDateTime'>{formatDate(publishDate)}</span>
            </div>

            <div className="onePostContent">
                <div className="onePostContentTitleAndLikes">
                    <h2>{title}</h2>
                    <Likes postId={id} />
                </div>

                <span className="postContent">{`${content}`}</span>
                {postImage && postImage !== 'undefined' ? <img src={`http://localhost:5000/posts/${postImage}`} className="postImage" /> : <></>}
            </div>

            <div className="onePostInfo">
                <PostCategories postId={id} />
                {admin && <ChangeActivity status={status == 'active' ? true : false} />}
                <FavAddDel />
                <Comments postId={id} commentId={null} />
            </div>
        </div>
    )
}

export default Post;