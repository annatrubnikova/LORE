import { useState, useEffect } from "react";
import axios from '../api/axios';
import Likes from './Likes';
import React from 'react';
import { fetchAllUsers, fetchUserRole, getFetchStatus } from '../store/users';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faComment, faCircleCheck } from '@fortawesome/free-solid-svg-icons';


const Comments = ({ postId = false }) => {
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();
    let role = useSelector((state) => state.users.role);
    let users = useSelector((state) => state.users.users);
    const [admin, setAdmin] = useState(false);
    const [id, setId] = useState(0);
    const isLoadingUs = useSelector(getFetchStatus);
    const token = Cookies.get('token');
    const [author, setAuthor] = useState();
    const [comDel, setComDel] = useState();
    const [content, setContent] = useState();
    const [changeComment, setChangeComment] = useState(false);

    useEffect(() => {
        if (users) {
            setAuthor(users);
        }
        if (role) {
            setId(role.id);
            if (role.role == 'Admin') setAdmin(true);
        }
    }, [users, role]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/posts/${postId}/comments`);
                dispatch(fetchUserRole(token));
                dispatch(fetchAllUsers());
                if (response.data.comments != null) {
                    setComments(response.data.comments);
                    setContent(changeComment.content);
                }
                else {
                    setComments([]);
                    setContent();
                }
            } catch (error) {
                setContent();
                console.error(error);
            }
        };

        fetchComments();
    }, [postId, comDel, changeComment]);

    const getAuthorLogin = (authorId) => {
        if (author) {
            const foundAuthor = author.find((user) => user.id === authorId);
            return foundAuthor ? foundAuthor.login : 'Unknown';
        }
        return 'Unknown';
    };

    const getAuthorAva = (authorId) => {
        if (author) {
            const foundAuthor = author.find((user) => user.id === authorId);
            return foundAuthor ? foundAuthor.avatar : 'Unknown';
        }
        return 'Unknown';
    };

    const handleDelete = async (idCom, error) => {
        error.preventDefault();

        try {
            const response = await axios.delete(
                `/comments/${idCom}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            if (response.data) {
                setComDel(idCom);
            }
        } catch (error) {
            console.log(error.response.data.error)
        }
    }

    const handleConfirmDelete = (idCom, e) => {
        e.preventDefault();
        const confirmed = window.confirm("Arey you sure you want to delete comment?");
        if (confirmed) {
            handleDelete(idCom, e);
        }
    }

    const submitEvent = async (error) => {
        error.preventDefault();
        try {
            const response = await axios.post(`/posts/${postId}/comments`,
                JSON.stringify({
                    content: content
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setComDel(content);
            setContent(null);
        } catch (error) {
            console.log(error.response.data.error)
        }
    }

    const changeCom = async (error, commentId) => {
        error.preventDefault();
        try {
            const response = await axios.patch(`/comments/${commentId}`,
                JSON.stringify({
                    content: content
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setComDel(content);
            setChangeComment(false);
            setContent(null);
        } catch (error) {
            console.log(error.response.data.error)
        }
    }
    return isLoadingUs ? <p>Loading</p> : (
        <div className="commentsBlock">
            {token ? <form className="writeCommentBlock" onSubmit={submitEvent}>
                <input
                    id="content"
                    placeholder="Write a comment"
                    className="rounded-input"
                    onChange={(e) => setContent(e.target.value)}
                    required></input>
                <button className="buttonWithIcon"><FontAwesomeIcon icon={faComment} /></button>
            </form> : null}

            {comments.map(comment => (
                <React.Fragment key={comment.id}>
                    <div className="oneCommentBlock">
                        <div className="commentAuthorInfo">
                            {changeComment.id !== comment.id && <span><img src={`http://localhost:5000/avatars/${getAuthorAva(comment.author_id)}`} /></span>}
                            {changeComment.id !== comment.id && <span className="commentAuthorName">{getAuthorLogin(comment.author_id)}</span>}
                        </div>
                        {changeComment.id !== comment.id && <span className="commentContent">{comment.content}</span>}
                        <div className="btns-container" style={changeComment ? { display: 'none' } : { display: 'flex' }}>
                            {changeComment.id !== comment.id && <Likes commentId={comment.id} postId={postId} />}
                            <div className="editDeleteCommentInfo">
                                {id == comment.author_id && !changeComment ? <button className="buttonWithIcon" onClick={() => setChangeComment(comment)}><FontAwesomeIcon icon={faPenToSquare} /></button> : null}
                                {(admin || id == comment.author_id) && changeComment.id !== comment.id ? <button className="buttonWithIcon" onClick={(e) => handleConfirmDelete(comment.id, e)}><FontAwesomeIcon icon={faTrash} /></button> : null}
                            </div>
                        </div>
                        {changeComment && changeComment.id == comment.id ?
                            <form className="writeCommentBlock editCommentBlock" onSubmit={(e) => changeCom(e, comment.id)}>
                                <div className="commentAuthorInfo">
                                    <span><img src={`http://localhost:5000/avatars/${getAuthorAva(comment.author_id)}`} /></span>
                                    <span className="commentAuthorName">{getAuthorLogin(comment.author_id)}</span>
                                </div>
                                <div className="editCommentContentAndBtn">
                                    <input
                                        id="content"
                                        className="rounded-input"
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        value={content}></input>

                                    <button className="buttonWithIcon"><FontAwesomeIcon icon={faCircleCheck} /></button>
                                </div>
                            </form> : null
                        }
                    </div>
                </React.Fragment>
            ))}

        </div>
    );
}

export default Comments;
