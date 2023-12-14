const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import config from '../config.js'
import sender from '../middleware/sender.js';


export const registration = async (req, res) =>{
    const { login, password, confirmPassword, email, fullname} = req.body;
    if (!login || !email || !password || !confirmPassword)return res.status(400).json({ error: 'Missing data' });
    if (password != confirmPassword) return res.status(400).json({ error: 'Passwords don\'t match' });
    if (await User.getByLogin(login) || await User.getByEmail(email)) return res.status(409).json({ error: 'Login or email already exists' });
    if(!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    const hashedPass = await bcrypt.hash(password, 8);
    const token = jwt.sign({
        login, email, fullname, hashedPass
    }, config.key, {expiresIn: '1d'});
    await sender(email, "Registration!", "register", token);
    return res.status(200).json({ 
        message: 'Check your email!'
    });
}

export const confirmMail = async (req, res) => {
    const {token} = req.params;
    const decoded = jwt.verify(token, config.key);
    if (!decoded) return res.status(400).json({ error: 'Invalid token.' });
    let {login, email, fullname, hashedPass} = decoded;
    const userCreated = {
        full_name: fullname,
        login: login,
        password: hashedPass,
        email: email
    };
    if(!await User.save(userCreated)) return res.status(500).json({ error: 'Error with creation of user.' });
    return res.status(200).json({ 
        message: 'Registration successful',
        user: userCreated
    });
}

export const login = async (req, res) =>{
    const { login, password} = req.body;
    if(!password || !login) return res.status(400).json({ error: 'Missing data' });
    const result = await User.getByLogin(login);
    if(!result) return res.status(409).json({ error: 'User doesn\'t exists' });
    const isPasswordValid = await bcrypt.compare(password, result.password);
    const usid = result.id;
    const role = result.role;
    const email = result.email;
    if (isPasswordValid) {
        const token = jwt.sign({
            usid, login, email, role
        }, config.key, {expiresIn: '1d'});
        return res.status(200).json({ 
            message: 'You\'re loggen in.',
            user: result,
            token: token
        });
    } else {
        return res.status(400).json({ error: 'Password is wrong.' });
    }
}

export const logout = async (req, res) => {
    return res.status(200).json({ 
        message: 'Logout successful',
        token: "undef" 
    });
}

export const resetpassword = async (req, res) =>{
    const {email} = req.body;
    if(!email) return res.status(400).json({ error: 'Missing data' });
    const result = await User.getByEmail(email);
    if(!result) return res.status(409).json({ error: 'Email doesn\'t exist' });
    const login = result.login;
    const token = jwt.sign({
        login , email
    }, config.key, {expiresIn: '1d'});
    await sender(email, "Reset Password", "reset", token);
    return res.status(200).json({message: "Check your email!"})
}

export const resetpasswordToken = async (req, res) =>{
    if(req.body.password != req.body.confirmPassword) return res.status(400).json({ error: 'Password doesn\'t match!' });
    const {token} = req.params; 
    let decoded;
    try{
        decoded = jwt.verify(token, config.key);
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token.' });
    }
    let {login} = decoded;
    const result = await User.getByLogin(login);
    if(!result) return res.status(409).json({ error: 'User doesn\'t exist.' });
    const id = result.id;
    const hashedPass = await bcrypt.hash(req.body.password, 8);
    if(!await User.save({
        id: id,
        password:hashedPass
    })) return res.status(500).json({ error: 'An error occured' });
    return res.status(200).json({ message: 'Password was changed.' });
}



