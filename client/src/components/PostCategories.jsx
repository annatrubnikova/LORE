import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostCategories } from '../store/posts';


const PostCategories = ({ postId }) => {
    const dispatch = useDispatch();

    let cat = useSelector((state) => state.posts.postCategories);
    const [categories, setCats] = useState();

    useEffect(() => {
        if (cat.info) {
            setCats(cat.info);
        }
    }, [cat]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                dispatch(fetchPostCategories(postId));
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, [dispatch]);

    return (
        <div className='show-cats' style={{ textAlign: 'center' }}>
            {categories ? categories.map((category, index) => (
                <span key={index} style={{ margin: '0 8px' }}><a href={`/categories/${category.id}`}>{category.title}</a> </span>
            )) : (
                <p>No categories available.</p>
            )}
        </div>
    );

}

export default PostCategories;
