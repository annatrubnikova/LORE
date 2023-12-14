import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Login = ({ user }) => {

    return (
        <button className="buttonWithIcon"><a href="/login"><FontAwesomeIcon className="logoutIcon" icon={faRightToBracket} /></a></button>
    );
}

export default Login;
