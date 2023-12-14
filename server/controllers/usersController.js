import User from '../models/user.js';
import Post from '../models/post.js';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js'

export const getAll = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sortBy = 'rating'} = req.query;
        const allUsers = await User.getAll();
        if (!allUsers) return res.status(200).json({ message: "Users don't exist" });
        res.status(200).json({ users: allUsers });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

export const getUser = async (req, res) => {
    try {
        const userByID = await User.getById(req.params.id);
        if (!userByID) res.status(409).json({ error: 'User doesn\'t exist' });
        else res.status(200).json({ message: "Success", user: userByID });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

export const createUser = async (req, res) => {
    const { login, password, confirmPassword, email, fullname, role} = req.body;
    if (!login || !email || !password || !role)return res.status(400).json({ error: 'Missing data' });
    if (password != confirmPassword) return res.status(400).json({ error: 'Passwords don\'t match' });
    if (await User.getByLogin(login) || await User.getByEmail(email)) return res.status(409).json({ error: 'Login or email already exists' });
    if(!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    const hashedPass = await bcrypt.hash(password, 8);
    const userCreated = {
        full_name: fullname,
        login: login,
        password: hashedPass,
        email: email,
        role: role
    };
    if(!await User.save(userCreated)) return res.status(500).json({ error: 'Error with creation of user.' });
    return res.status(200).json({ 
        message: 'Registration successful',
        user: userCreated,
    });
}

export const changeUser = async (req, res) => {
    const userId = req.params.id;
    if(!await User.getById(userId)) return res.status(400).json({ error: 'User doesn\'t exist.' });
    const { login, password, email, fullname, role} = req.body;
    if(userId != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    if (await User.getByLogin(login) && req.user.login != login || await User.getByEmail(email) && req.user.email != email) return res.status(409).json({ error: 'Login or email already exists' });
    let updatedUserData = {
        id: userId
    };
    if(fullname) updatedUserData = {
        ...updatedUserData,
        full_name: fullname
    };
    if(login) updatedUserData = {
        ...updatedUserData,
        login: login
    };
    if(email) updatedUserData = {
        ...updatedUserData,
        email: email
    };
    if(req.user.role.includes("Admin") && role) updatedUserData = {
        ...updatedUserData,
        role: role
    };
    if (!await User.save(updatedUserData)) return res.status(500).json({ error: 'Error updating user data.' });
    res.status(200).json({ message: 'User updated successfully'});
};

export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    const userToDel = await User.getById(userId);
    if(userToDel.id != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    if(!userToDel) return res.status(409).json({ error: 'User doesn\'t exist.' });
    if(!await User.deleteUser(userId)) return res.status(500).json({ error: 'An error occured.' });
    return res.status(200).json({ message: 'User was deleted.' });
}

export const changeAvatar = async (req, res) => {
    const userId = req.user.usid;
    const userToChangeId = req.body.id;
    const userTochange = await User.getById(userToChangeId);
    if(!userTochange) return res.status(409).json({ error: 'User doesn\'t exist.' });
    if(userToChangeId != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    let file;
    try {
        file = req.file.filename;
    }
    catch {
        return res.status(400).json({ error: 'Missing data.' });
    }
    const updatedAvatar = {
        id: userId,
        avatar: file
    };
    if (!await User.save(updatedAvatar)) return res.status(500).json({ error: 'Error updating avatar.' });
    res.status(200).json({ message: 'Avatar updated successfully'});
}

export const userPosts = async (req, res) => {
    const { sortBy = 'likes' } = req.query;
    const { id } = req.params;
    let postByIdUser = await Post.getByUser(id, sortBy);
    if(!id || !postByIdUser) {
        return res.status(409).json({ error: "Post doesn't exist." });
    }
    return res.status(200).json({ 
        message: "Success",
        posts: postByIdUser 
    });
}

export const userRole = async (req, res) => {
    const { token } = req.params;
    if (token == 'undef' || token == "undefined") return res.status(400).json({ error: 'Invalid token.' });
    const decoded = jwt.verify(token, config.key);
    if (!decoded) return res.status(400).json({ error: 'Invalid token.' });
    const {role, usid, login} = decoded;
    return res.status(200).json({ 
        message: "Success",
        role: role,
        id: usid,
        login: login
    });
}
