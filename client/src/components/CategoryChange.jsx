import { useEffect, useState } from "react";
import axios from '../api/axios';
import { Outlet } from 'react-router-dom';
import Logout from "./Logout";
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const CategoryChange = () => {
    const [title, setTitle] = useState();
    const [checkTit, setCheckTitle] = useState();
    const [description, setDescription] = useState();
    const token = Cookies.get('token');
    const [errMsg, setErrMsg] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await axios.get(`/categories/${id}`);
                setTitle(response.data.category.title);
                setCheckTitle(response.data.category.title);
                setDescription(response.data.category.description);
            }
            catch (error) {
                console.log(error);
            }
        }

        getCategory();
    }, []);

    const submitEvent = async (error) => {
        error.preventDefault();
        let catToChange;
        if (title && title !== checkTit) {
            catToChange = {
                title: title
            }
        }
        if (description) {
            catToChange = {
                ...catToChange,
                description: description
            }
        }
        try {
            const response = await axios.patch(
                `/categories/${id}`,
                catToChange,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setErrMsg(response.data.error);
        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    return (
        <form className="editCategoryBlock shadowEffect" onSubmit={submitEvent}>
            <span>edit category</span>
            <div className="editCategoryForm">
                <div className="input-container">
                    <textarea
                        id="title"
                        placeholder="title"
                        className={`rounded-input ${errMsg ? 'invalid' : ''}`}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrMsg('');
                        }}
                        required
                        value={title}></textarea>
                    <div className={`${errMsg ? 'error-icon' : 'hidden'}`}>!</div>
                    <div className={`error-tooltip ${errMsg ? 'errorIsShown' : 'hidden'}`}>
                        {errMsg}
                    </div>
                </div>
                <div className="input-container">
                    <textarea
                        id="description"
                        placeholder="description"
                        className="rounded-input"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        value={description}></textarea>
                </div>
            </div>
            <button className="buttonWithIcon"><FontAwesomeIcon icon={faCircleCheck} /></button>
        </form>
    )
}

export default CategoryChange;