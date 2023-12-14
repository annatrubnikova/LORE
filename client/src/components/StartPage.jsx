import '../css/style.css'
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const StartPage = () => {
    const shouldRedirect = true;
    const token = Cookies.get('token');

    if (shouldRedirect) {
        if (token) return <Navigate to="/posts" />;
        else return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Lore</h1>
        </div>
    )
};

export default StartPage;