import Post from '../models/post.js';
import Comment from '../models/comment.js';
import Category from '../models/category.js';
import Like from '../models/like.js';
import User from '../models/user.js';


//example http://www.localhost:5000/api/posts?page=1&pageSize=10&sortBy=likes&filter[categories]=category1&filter[categories]=category2&filter[startDate]=2023-01-01&filter[endDate]=2023-12-31&filter[status]=active
export const getAll = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'likes', filter } = req.query;
        const offset = (page - 1) * pageSize;
        const allPosts = await Post.getAllPaginated(offset, pageSize, sortBy, filter);
        let pages = await Post.getAll();
        pages = Math.ceil(pages.length / pageSize);
        if (!allPosts || allPosts.length === 0) {
            return res.status(200).json({
                message: "No posts found for the specified page."
            });
        }

        res.status(200).json({
            message: "Success",
            posts: allPosts,
            pages: pages
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Server Error"
        });
    }
};


export const getById = async (req, res) => {
    const { id } = req.params;
    let postById = await Post.getById(id);
    if (!id || !postById) {
        return res.status(409).json({ error: "Post doesn't exist." });
    }
    return res.status(200).json({
        message: "Succes",
        post: postById
    });
}

export const getPostComments = async (req, res) => {
    let allComments = await Comment.getAllByPostID(req.params.id);
    if (!allComments) {
        return res.status(200).json({
            message: "Comments don't exist",
            comments: null
        });
    }
    if (allComments) {
        return res.status(200).json({
            message: "Succes",
            comments: allComments
        });
    }
    else {
        return res.status(500).json({ error: "Something went wrong." });
    }
}

export const createPostComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    if (!content) {
        return res.status(400).json({ error: 'Missing data.' });
    }
    const post = await Post.getById(postId);
    if (!post) {
        return res.status(409).json({ error: 'Post doesn\'t exist.' });
    }
    let id = req.user.usid;
    const commentCreated = {
        author_id: id,
        postId: postId,
        content: content,
        status: "active"
    };

    if (!await Comment.save(commentCreated)) return res.status(500).json({ error: 'Error with creation of comment.' });

    return res.status(200).json({
        message: 'Comment was made.'
    });

}

export const getPostCategories = async (req, res) => {
    const id = req.params.id;
    let postCat = await Post.getById(id);
    if (!postCat) {
        return res.status(409).json({
            error: "Post don't exist"
        });
    }
    let allCategories = await Post.getAllCategoriesByIdPost(postCat.id);
    let categoryIds = allCategories.map(category => category.category_id);
    let infoCat = await Category.getCatByIds(categoryIds);
    if (!allCategories) {
        return res.status(200).json({
            message: "Categories don't exist for given post."
        });
    }

    return res.status(200).json({
        message: "Succes",
        categories: allCategories,
        info: infoCat
    });
}

export const getPostLikes = async (req, res) => {
    const id = req.params.id;
    let postLike = await Post.getById(id);
    if (!postLike) {
        return res.status(409).json({
            error: "Post doesn't exist"
        });
    }
    let allLikes = await Like.getAllLikesById(id, "likes_post", "post_id");
    if (!allLikes) {
        return res.status(200).json({
            message: "Likes don't exist for given post."
        });
    }
    return res.status(200).json({
        message: "Success",
        likes: allLikes
    });
}

export const createPost = async (req, res) => {
    let { title, content, categories } = req.body;
    if (!title || !content || !categories) {
        return res.status(400).json({ error: 'Missing data.' });
    }
    if (typeof categories === 'string') {
        categories = JSON.parse(categories);
    }
    if (!Array.isArray(categories)) {
        categories = [categories];
    }
    else if (categories.length < 1) {
        return res.status(400).json({ error: 'You need to choose categories!' });
    }
    let { usid } = req.user;
    let postCreated = {
        author_id: usid,
        title: title,
        content: content
    };
    const postId = await Post.save(postCreated)
    if (!postId) return res.status(500).json({ error: 'Error with creation of post.' });
    let id = postId.id;
    for (let catId of categories) {
        if (!await Post.save({
            post_id: id,
            category_id: catId
        }, "posts_categories")) {
            await Post.delete(id);
            return res.status(500).json({ error: 'Error with creation of post.' });
        }
    }
    const idOfpost = postId.id;
    return res.status(200).json({
        message: 'Post was made.',
        id: idOfpost
    });
}

export const createPostImage = async (req, res) => {
    let file;
    try {
        file = req.file.filename;
    }
    catch {
        file = null;
    }
    let { usid } = req.user;
    let id = req.body.id;
    let postCreated = {
        id: id,
        author_id: usid
    };
    if (file) {
        postCreated = {
            ...postCreated,
            image: file
        };
    }
    const postId = await Post.save(postCreated)
    if (!postId) return res.status(500).json({ error: 'Error with creation of post.' });

    return res.status(200).json({
        message: 'Post was made.'
    });
}

export const createPostLike = async (req, res) => {
    const postId = req.params.id;
    if (req.body.like == undefined) {
        return res.status(400).json({ error: 'Missing data.' });
    }
    const post = await Post.getById(postId);
    if (!post) {
        return res.status(409).json({ error: 'Post doesn\'t exist.' });
    }
    let like;
    if (req.body.like == true) { like = "like"; }
    else { like = "dislike"; }
    let { usid } = req.user;
    let ifLikeExist = await Like.getById(postId, "likes_post", usid);
    if (ifLikeExist && ifLikeExist.type != like) {
        if (!await Like.deleteById(ifLikeExist.id, "likes_post")) return res.status(500).json({ error: 'An error while deleting previous like.' });
    }
    else if (ifLikeExist && ifLikeExist.type == like) {
        return res.status(409).json({
            message: `${like} already exist.`
        });
    }
    const likeCreated = {
        author_id: usid,
        post_id: postId,
        type: like
    };

    if (!await Like.save(likeCreated, "likes_post")) return res.status(500).json({ error: 'Error with creation of like.' });
    const author = await User.getById(post.author_id);
    let { id, rating } = author;
    if (like == 'like') rating = rating + 1;
    else if (rating != 0) rating = rating - 1;
    const userRat = {
        id: id,
        rating: rating
    }
    await User.save(userRat);
    return res.status(200).json({
        message: `${like} was created.`
    });
}

export const changePostById = async (req, res) => {
    const someid = req.params.id;
    const { title, content, categories, status } = req.body;
    if (!req.body) return res.status(400).json({ error: 'Missing data.' });
    if (!Array.isArray(categories) && !status) {
        categories = [categories];
    }
    else if (categories && categories.length < 1 && !status) {
        return res.status(400).json({ error: 'You need to choose categories!' });
    }
    const postToChange = await Post.getById(someid);
    if (!postToChange) return res.status(409).json({ error: 'Post doesn\'t exist' });
    if (postToChange.author_id != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    let postCreated = {
        id: someid
    };
    if (title && postToChange.author_id == req.user.usid) {
        postCreated = {
            ...postCreated,
            title: title
        };
    }
    if (content && postToChange.author_id == req.user.usid) {
        postCreated = {
            ...postCreated,
            content: content
        };
    }
    if (status) {
        postCreated = {
            ...postCreated,
            status: status
        };
    }

    if (content || title || status) {
        const updatedPost = await Post.save(postCreated);
        if (!updatedPost) return res.status(500).json({ error: 'Error with update of post.' });
    }

    if (categories && !status) {
        if (!await Category.deleteAllByPostId(someid)) return res.status(500).json({ error: 'Error with update of post.(Category del)' });
        for (let catId of categories) {

            if (!await Post.save({
                post_id: someid,
                category_id: catId
            }, "posts_categories")) {
                return res.status(500).json({ error: 'Error with update of post.(Category)' });
            }
        }
    }
    return res.status(200).json({
        message: 'Post was updated.'
    });
}

export const deletePostById = async (req, res) => {
    const PostId = req.params.id;
    if (!await Post.getById(PostId)) return res.status(409).json({ error: 'Post doesn\'t exist.' });
    if (!await Post.delete(PostId)) return res.status(500).json({ error: 'An error while deleting post.' });
    return res.status(200).json({ message: 'Post was deleted.' });
}

export const deletePostLike = async (req, res) => {
    const PostId = req.params.id;
    if (!await Post.getById(PostId)) return res.status(409).json({ error: 'Post doesn\'t exist.' });
    const likeToDel = await Like.getById(PostId, "likes_post", req.user.usid);
    if (!likeToDel) return res.status(409).json({ error: 'Like doesn\'t exist.' });
    if (!await Like.deleteById(likeToDel.id, "likes_post")) return res.status(500).json({ error: 'An error while deleting like.' });
    return res.status(200).json({ message: 'Like was deleted.' });
}
