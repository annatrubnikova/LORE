import { useRef, useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const ConfirmReg = () => {
    const { token } = useParams();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const register = async () => {
            try {
                const response = await axios.get(`/auth/confirmation/${token}`);
                setStatus(response.status);
            } catch (error) {
                console.error(error);
            }
        }
        register();
    }, []);


    return (
        <div className="confirmationBlock">
            <h2>Confirmation registration</h2>
            {status === 200 ? (
                <form>
                    <h1>You've been successfully registered!</h1>
                    <Link to="/login">
                        <button className="submitBtn submitConfirmBtn">Login</button>
                    </Link>
                </form>
            ) : (
                <form>
                    <h1>An error occurred. Try again.</h1>
                    <Link to="/register">
                        <button className="submitBtn submitConfirmBtn">Register</button>
                    </Link>
                </form>
            )}
        </div>
    )
}

export default ConfirmReg;