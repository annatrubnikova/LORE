import React, { useEffect, useState } from "react";
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import DelPost from "./DelPost";

const ChangePost = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const token = Cookies.get('token');
    const usid = Cookies.get('id');
    const [message, setErrMsg] = useState('');

    useEffect(() => {
        if (!token) navigate('/login');
        const fetchData = async () => {
            try {
                const postResponse = await axios.get(`/posts/${id}`);
                const postCategories = await axios.get(`/posts/${id}/categories`);
                const categoriesResponse = await axios.get('/categories');
                const post = postResponse.data.post;
                if (post.author_id != usid || !post) navigate('/posts');
                setTitle(post.title);
                setContent(post.content);
                setSelectedCategories(postCategories.data.categories.map(category => category.category_id));
                setCategories(categoriesResponse.data.categories);
            } catch (error) {
                setErrMsg(error);
            }
        };

        fetchData();
    }, [id]);

    const submitEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `/posts/${id}`,
                {
                    title: title,
                    content: content,
                    categories: selectedCategories,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            if (response.data.error) {
                setErrMsg(response.data.error);
            }
            else navigate('/posts');
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const setFile = (error) => {
        setImage(error.target.files[0]);
        const closestInputFile = error.target.closest('.input-file');
        const inputText = closestInputFile.querySelector('.input-file-text');
        inputText.innerHTML = error.target.files[0].name;
    };

    return (
        <form className="form-container changePostForm" onSubmit={submitEvent}>
            {message}
            <div className="changePostInput">
                <label className="form-label" htmlFor="title">Title</label>
                <input
                    className="rounded-input"
                    id="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                />
            </div>

            <div className="changePostInput">
                <label className="form-label" htmlFor="content">Content</label>
                <textarea
                    className="form-textarea shadowEffect"
                    id="content"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    required
                />
            </div>

            <div className="changePostInput autoCenter">
                <label className="form-label">Select categories</label>
                <div className="form-checkbox-group">
                    {categories.map((category) => (
                        <label key={category.id} className="form-checkbox-label">
                            <span className="form-input-title">{category.title}</span>
                            <input
                                className="form-checkbox-input"
                                type="checkbox"
                                value={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="changePostInput shadowEffect chooseFileSection">
                <label class="input-file">
                    <span class="input-file-text" type="text"></span>
                    <input
                        className="file-select"
                        type="file"
                        onChange={setFile}
                        accept="image/jpeg,image/png,image/jpg"
                    />
                    <span class="input-file-btn">Upload file</span>
                </label>
            </div>

            <button>Update post</button>
            <DelPost post={id} />
        </form>
    )
}

export default ChangePost;
