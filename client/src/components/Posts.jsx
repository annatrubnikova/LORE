import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsByUser, fetchPostsCategory, fetchAllPosts, getFetchStatusPost, isLoadingPosts, fetchPostsFav } from '../store/posts';
import { fetchAllUsers, fetchUserRole, getFetchStatus } from '../store/users';
import React from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";


const Posts = ({ category = false, user = false, page = 1, fav = false }) => {
    const dispatch = useDispatch();
    let role = useSelector((state) => state.users.role);
    const [admin, setAdmin] = useState(false);
    const id = Cookies.get('id');
    const isLoadingUs = useSelector(getFetchStatus);
    const isLoadingPost = useSelector(isLoadingPosts);
    const [sort, setSort] = useState('sortBy=date');
    const [activepost, setActivePost] = useState('&filter[status]=active');

    const [posts, setPosts] = useState();
    const [author, setAuthor] = useState();
    const [pages, setPages] = useState();
    const [currentPage, setCurrentPage] = useState(page);
    let allposts = useSelector((state) => state.posts.posts);
    let userPosts = useSelector((state) => state.posts.postsUser);
    let favour = useSelector((state) => state.posts.fav);
    let catPosts = useSelector((state) => state.posts.postsCategory);
    let usersFromPosts = useSelector((state) => state.users.users);
    const token = Cookies.get('token');

    useEffect(() => {
        if (userPosts.posts) {
            setPosts(userPosts.posts);
        } else if (catPosts.posts) {
            setPosts(catPosts.posts);
            setAuthor(usersFromPosts);
        } else if (favour.favorites) {
            setPosts(favour.favorites);
            setAuthor(usersFromPosts);
        } else {
            setPages(allposts.pages);
            setPosts(allposts.posts);
            setAuthor(usersFromPosts);
        }
    }, [userPosts, catPosts, allposts, favour]);

    useEffect(() => {
        try {
            if (user) {
                dispatch(fetchPostsByUser({ id: user, params: `?${sort}` }));
                dispatch(fetchUserRole(token));
            }
            else if (category) {
                dispatch(fetchAllUsers());
                dispatch(fetchPostsCategory({ id: category, params: `?${sort}` }));
                dispatch(fetchUserRole(token));
                if (role.role == "Admin") setAdmin(true);
            }
            else if (fav) {
                dispatch(fetchAllUsers());
                dispatch(fetchUserRole(token));
                dispatch(fetchPostsFav({ token: token, params: `?${sort}` }));
            }
            else {
                dispatch(fetchUserRole(token));
                dispatch(fetchAllUsers());
                dispatch(fetchAllPosts(`?${sort}&page=${currentPage}${activepost}`));

                if (role.role == "Admin") setAdmin(true);
            }
        }
        catch (error) {
            console.log(error);
        }

    }, [dispatch, sort, currentPage, activepost, fav]);

    const getAuthorLogin = (authorId) => {
        const foundAuthor = author.find((user) => user.id === authorId);
        return foundAuthor ? foundAuthor.login : 'Unknown';
    };

    const getAuthorAva = (authorId) => {
        const foundAuthor = author.find((user) => user.id === authorId);
        return foundAuthor ? foundAuthor.avatar : false;
    }

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

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };
    return isLoadingUs || isLoadingPost ? <p>Loading</p> : (
        <>  {!user && token ? <button><a href={`/posts/create`}>Create post</a></button> : null}
            <div className="filter-options"> <select id="sort"
                onChange={(e) => setSort(e.target.value)}
                required
                value={sort}>
                <option value="sortBy=date" selected>Date</option>
                <option value="sortBy=like">Like</option>
            </select>
                <select id="activepost"
                    onChange={(e) => setActivePost(e.target.value)}
                    required
                    value={activepost}>
                    <option value="&filter[status]=active" selected>Active</option>
                    <option value="&filter[status]=inactive">Inactive</option>
                </select> </div>
            {posts && !user && pages > 1 ? <div className="pages-handle">
                <button className="buttonWithIcon" onClick={handlePrevPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <span>{currentPage}</span>
                <button className="buttonWithIcon" onClick={handleNextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div> : null}
            <div className={user ? "postUser" : "postCategory"}>
                {posts ? posts.map((post) => (
                    <React.Fragment key={post.id}>
                        <div className="postBlock shadowEffect">
                            <div className="postAuthorAndBtn">
                                {!user ? <div className="postAuthor">
                                    <div className="postAuthorAvaAndName">
                                        {getAuthorAva(post.author_id) ? <img src={`http://localhost:5000/avatars/${getAuthorAva(post.author_id)}`} /> : null}
                                        <span>{getAuthorLogin(post.author_id)}</span>
                                    </div>
                                    <span className="postDateTime">{formatDate(post.publishDate)}</span>
                                </div> : null}
                                {id == post.author_id ? <button className="buttonWithIcon"><a href={`/posts/change/${post.id}`}><FontAwesomeIcon icon={faPenToSquare} /></a></button> : null}
                            </div>
                            <h2><a href={`/posts/${post.id}`}>{post.title}</a></h2>
                            <span className="postContent"><a href={`/posts/${post.id}`}>{post.content}</a></span>
                            {post.image && post.image !== 'undefined' ? <img src={`http://localhost:5000/posts/${post.image}`} className="postImage" /> : <></>}
                        </div>
                    </React.Fragment>
                )) : (
                    <p>No posts available.</p>
                )}
            </div>
            {posts && pages > 1 ? <div className="pages-handle">
                <button className="buttonWithIcon" onClick={handlePrevPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <span>{currentPage}</span>
                <button className="buttonWithIcon" onClick={handleNextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div> : null}
        </>
    )
}

export default Posts;