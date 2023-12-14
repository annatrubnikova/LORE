import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Posts from './Posts';
import Cookies from 'js-cookie';

const Favourites = () => {
    const id = Cookies.get('id');
        return (
            <Posts fav={id} />
        )
}

export default Favourites;