import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSquarePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserRole, getFetchStatus } from '../store/users';

const Categories = () => {
    const dispatch = useDispatch();
    let role = useSelector((state) => state.users.role);
    const isLoadingUs = useSelector(getFetchStatus);
    const [admin, setAdmin] = useState(false);
    const [cats, setCats] = useState([]);
    const token = Cookies.get('token');
    const [deletedCategoryId, setDeletedCategoryId] = useState(null);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [titleChange, setTitleChange] = useState();
    const [descriptionChange, setDescriptionChange] = useState();
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();
    const [createdCategory, setCreatedCategory] = useState(null);
    const [changeCat, setChangeCat] = useState(false);
    const [checkTit, setCheckTitle] = useState();
    const [errMsgEdit, setErrMsgForEdit] = useState('');

    useEffect(() => {
        if (role && role.role == 'Admin') {
            setAdmin(true);
        }
    }, [role]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get('/categories');
                setCats(response.data.categories)
                dispatch(fetchUserRole(token));
                if (changeCat) {
                    setCheckTitle(changeCat.title);
                    setTitleChange(changeCat.title);
                    setDescriptionChange(changeCat.description);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getCategories();
    }, [deletedCategoryId, createdCategory, dispatch, changeCat]);

    const submitEvent = async (error) => {
        error.preventDefault();
        try {
            const response = await axios.post('/categories',
                JSON.stringify({
                    title: title,
                    description: description
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            if (response.data.message) {
                setTitle('');
                setDescription('');
                setCreatedCategory(title);
            } else {
                setErrMsg(response.data.error);

            }

        } catch (error) {
            setErrMsg(error.response.data.error)
        }
    }

    const handleDelete = async (id, error) => {
        error.preventDefault();

        try {
            const response = await axios.delete(
                `/categories/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            if (response.data) {
                setDeletedCategoryId(id);
            }
        } catch (error) {
            console.log(error.response.data.error)
        }
    }

    const handleConfirmDelete = (id, e) => {
        e.preventDefault();
        const confirmed = window.confirm("Arey you sure you want to delete category?");
        if (confirmed) {
            handleDelete(id, e);
        }
    }

    const changeCategory = async (error, cat) => {
        error.preventDefault();
        let catToChange;
        if (titleChange && titleChange !== checkTit) {
            catToChange = {
                title: titleChange
            }
        }
        if (descriptionChange) {
            catToChange = {
                ...catToChange,
                description: descriptionChange
            }
        }
        try {
            const response = await axios.patch(
                `/categories/${cat.id}`,
                catToChange,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            setErrMsgForEdit(response.data.error);
            if (response.data.message) {
                setTitleChange('');
                setDescriptionChange('');
                setCreatedCategory(response.data.message);
                setChangeCat(false);
            }
        } catch (error) {
            setErrMsgForEdit(error.response.data.error)
        }
    }

    return isLoadingUs ? <p>Loading</p> : (
        <div className="categoriesBlock">
            {admin ? (
                <form className="newCategoryCreate shadowEffect" onSubmit={submitEvent}>
                    <span>new category</span>
                    <div className="newCategoryCreateForm">
                        <div>
                            <div className="input-container">
                                <input
                                    id="title"
                                    placeholder="title"
                                    className={`rounded-input ${errMsg ? 'invalid' : ''}`}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setErrMsg('');
                                    }}
                                    required
                                    value={title}
                                />
                                <div className={`${errMsg ? 'error-icon' : 'hidden'}`}>!</div>
                                <div className={`error-tooltip ${errMsg ? 'errorIsShown' : 'hidden'}`}>
                                    {errMsg}
                                </div>
                            </div>
                            <div className="input-container">
                                <input
                                    id="description"
                                    placeholder="description"
                                    className="rounded-input"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    value={description}
                                />
                            </div>
                        </div>
                        <button className="buttonWithIcon"><FontAwesomeIcon icon={faSquarePlus} /></button>
                    </div>
                </form>
            ) : null}
            {token && <div className="categoryContainer shadowEffect" >
                <div className="fields-container">
                    <p className="rounded-input"><a href={`/categories/favourites`}>Favourites</a></p>
                    <p className="rounded-input">Your favourites posts!</p>
                </div>
            </div>}
            {cats ? cats.map((cat) => (
                <div key={cat.id} className="categoryContainer shadowEffect" >
                    <div className="fields-container">
                        {changeCat.id !== cat.id && <p className="rounded-input"><a href={`/categories/${cat.id}`}>{cat.title}</a></p>}
                        {changeCat.id !== cat.id && <p className="rounded-input">{cat.description}</p>}
                        {changeCat && changeCat.id == cat.id ?
                            <form onSubmit={(e) => changeCategory(e, cat)}>
                                <div className="newCategoryCreateForm editCategoryCreateForm">
                                    <div className="input-help">
                                        <div className="input-container">
                                            <input
                                                id="title"
                                                placeholder="title"
                                                className={`editCategoryInput editCategoryInput1 rounded-input ${errMsgEdit ? 'invalid' : ''}`}
                                                onChange={(e) => setTitleChange(e.target.value)}
                                                required
                                                value={titleChange}></input>
                                            <div className={`${errMsgEdit ? 'error-icon' : 'hidden'}`}>!</div>
                                            <div className={`error-tooltip ${errMsgEdit ? 'errorIsShown' : 'hidden'}`}>
                                                {errMsgEdit}
                                            </div>
                                        </div>
                                        <div className="input-container">
                                            <input
                                                id="description"
                                                placeholder="description"
                                                className="editCategoryInput rounded-input"
                                                onChange={(e) => setDescriptionChange(e.target.value)}
                                                required
                                                value={descriptionChange}></input>
                                        </div>
                                    </div>
                                    <button className="buttonWithIcon"><FontAwesomeIcon icon={faCircleCheck} /></button>
                                </div>
                            </form> : null
                        }
                    </div>
                    <div className="btns-container">
                        {admin && changeCat.id !== cat.id ? <button className="buttonWithIcon" onClick={(e) => handleConfirmDelete(cat.id, e)}><FontAwesomeIcon icon={faTrash} /></button> : null}
                        {admin && changeCat.id !== cat.id ? <button className="buttonWithIcon" onClick={() => setChangeCat(cat)}> <FontAwesomeIcon icon={faPenToSquare} /></button> : null}
                    </div>
                </div>
            )) : <></>}
        </div>
    )
}

export default Categories;