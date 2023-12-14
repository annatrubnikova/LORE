import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Posts from './Posts';

const Category = () => {
    const { id } = useParams();

    return (
        <Posts category={id} />
    )
}

export default Category;