import { useEffect, useState } from "react";
import axios from '../api/axios';
import { Outlet } from 'react-router-dom';
import Logout from "./Logout";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [image, setImage] = useState(null);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [message, setErrMsg] = useState('');

    useEffect(() => {
        if (!token) navigate('/login');
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                setCategories(response.data.categories);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCategories();
    }, []);

    const submitEvent = async (error) => {
        error.preventDefault();
        try {
            const data = {
                title: title,
                content: content,
                categories: selectedCategories
            };
            const response = await axios.post('/posts', data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            if (response && response.data.message) {
                const formData = new FormData();
                formData.append('image', image);
                formData.append('id', response.data.id);
                const imageUpload = await axios.patch('/posts/image', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                if (imageUpload.data.message) {
                    navigate('/posts');
                }
                else {
                    setErrMsg(response.data.error);
                }

            } else {
                setErrMsg(response.data.error);
            }

        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    const setFile = (error) => {
        setImage(error.target.files[0]);
        const closestInputFile = error.target.closest('.input-file');
        const inputText = closestInputFile.querySelector('.input-file-text');
        inputText.innerHTML = error.target.files[0].name;
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter((id) => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
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
                    required
                />
            </div>

            <div className="changePostInput">
                <label className="form-label" htmlFor="content">Content</label>
                <textarea
                    className="form-textarea shadowEffect"
                    id="content"
                    onChange={(e) => setContent(e.target.value)}
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

            <button className="form-button">Create new post</button>
        </form>

    )
}

export default CreatePost;
