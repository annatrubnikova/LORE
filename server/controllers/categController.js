import Post from '../models/post.js';
import Category from '../models/category.js';
import Favorites from '../models/favorite.js';

const handleSuccess = (res, data) => {
    return res.status(200).json({
        message: "Success",
        ...data
    });
};

const handleError = (res, message, status) => {
    return res.status(status).json({
        error: message
    });
};

export const getAll = async (req, res) => {
    try {
        const allCat = await Category.getAll();
        if (!allCat) return handleError(res, "Categories don't exist", 409);
        return handleSuccess(res, { categories: allCat });
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
}; 

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const catById = await Category.getById(id);
        if (!id || !catById) return handleError(res, "Category doesn't exist.", 409);
        return handleSuccess(res, { category: catById });
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
};

export const getCategoryPosts = async (req, res) => {
    try {
        const { sortBy = 'likes' } = req.query;
        const { id } = req.params;
        const catById = await Category.getById(id);
        if (!catById) return handleError(res, "Category doesn't exist.", 409);
        const allPostsId = await Post.getAllByIdCat(id, sortBy);
        const allPosts = await Promise.all(
            allPostsId.map(async (post) => await Post.getById(post.id))
        );
        return handleSuccess(res, { posts: allPosts });
    } catch (error) {
        return handleError(res, "An error occurred.", 500);
    }
};

export const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return handleError(res, 'Missing data.', 400);
        const catCreated = { title };

        if (description) {
            catCreated.description = description;
        }

        const catId = await Category.save(catCreated);
        if (!catId) return handleError(res, 'Error with creation of category.', 500);
        return handleSuccess(res, { message: 'Category was made.'});
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
};

export const changeCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!req.body) {
            return handleError(res, 'Missing data.', 400);
        }
        let ifExist = await Category.getByName(title)
        if(ifExist && ifExist.id != id) return handleError(res, 'Title already exist', 409);
        const catCreated = { id };

        if (title) {
            catCreated.title = title;
        }

        if (description) {
            catCreated.description = description;
        }

        const catId = await Category.save(catCreated);
        if (!catId) {
            return handleError(res, 'Error with creation of post.', 500);
        }
        return handleSuccess(res, { message: 'Category was updated.' });
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const catId = req.params.id;
        if (!await Category.getById(catId)) return handleError(res, "Category doesn't exist.", 409);
        if (!await Category.delete(catId)) return handleError(res, 'An error while deleting category.', 500);
        return handleSuccess(res, { message: 'Category was deleted.' });
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
};

export const addFavorites = async (req, res) => {
    let { post_id } = req.body;
    if(!post_id) {
        return handleError(res, 'Missing data.', 400);
    }
    let {usid} = req.user;
    let postCreated = {
        user_id: usid,
        post_id: post_id
    };
    if(!await Favorites.save(postCreated)) return handleError(res, 'Error with adding of post.', 500);
    return handleSuccess(res, { message: 'Post added to favorites.' });
}

export const deletePostByIdFromFavorites  = async (req, res) => {
    const PostId = req.params.id;
    const {usid} = req.user;
    if(!await Favorites.getById(PostId, usid)) return handleError(res, "Post isn\'t in favorites.", 409);
    if(!await Favorites.delete(PostId, usid)) return handleError(res, "An error while deleting post.", 500);
    return handleSuccess(res, { message: 'Post was deleted from favorites.' });
}


export const getAllFavourites = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'likes', filter } = req.query;
        const {usid} = req.user;
        const allCat = await Favorites.getAllByUsID(usid, sortBy);
        if (!allCat) return handleSuccess(res, { posts: null});
        return handleSuccess(res, { favorites: allCat });
    } catch (error) {
        return handleError(res, "Something went wrong.", 500);
    }
}

