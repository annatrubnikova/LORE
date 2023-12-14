import Post from '../models/post.js';
import Comment from '../models/comment.js';
import Like from '../models/like.js';
import User from '../models/user.js';


export const getCommentById = async (req, res) =>{
    const { id } = req.params;
    let commentById = await Comment.getById(id);
    if(!id || !commentById) return res.status(409).json({ error: "Comment doesn't exist." });
    return res.status(200).json({ 
        message: "Success",
        comment: commentById 
    });
}

export const getCommentLikes = async (req, res) =>{
    const id = req.params.id;
    let commLike = await Comment.getById(id);
    if(!commLike) {
        return res.status(409).json({ 
            error: "Comment doesn't exist"
        });
    }
    let allLikes = await Like.getAllLikesById(id, "likes_comment", "comment_id");
    if(!allLikes) {
        return res.status(200).json({ 
            message: "Likes don't exist for given comment."
        }); 
    }
    return res.status(200).json({ 
        message: "Success",
        likes: allLikes 
    });
}

export const createCommentLike = async (req, res) =>{
    const commId = req.params.id;
    if(req.body.like == undefined) return res.status(400).json({ error: 'Missing data.' });
    const comment = await Comment.getById(commId);
    if (!comment)return res.status(409).json({ error: 'Comment doesn\'t exist.' });
    let like;
    if(req.body.like == true) {like = "like";}
    else {like = "dislike";}
    let {usid} = req.user;
    let ifLikeExist = await Like.getById(commId, "likes_comment", usid);
    if (ifLikeExist && ifLikeExist.type != like) {
        if(!await Like.deleteById(ifLikeExist.id, "likes_comment")) return res.status(500).json({ error: 'An error while deleting previous like.' });
    }
    else if (ifLikeExist && ifLikeExist.type == like){
        return res.status(409).json({ 
            message: `${like} already exist.`
        });
    }
    const likeCreated = {
        author_id: usid,
        comment_id: commId,
        type: like
    };

    if(!await Like.save(likeCreated, "likes_comment")) return res.status(400).json({ error: 'Error with creation of like.' });
    const author = await User.getById(comment.author_id);
    let {id, rating} = author;
    if(like == 'like') rating = rating + 1;
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

export const changeCommentById = async (req, res) =>{
    const { content, status } = req.body;
    const commentId = req.params.id;
    if(!content && !status) return res.status(400).json({ error: 'Missing data.' });
    const comment = await Comment.getById(commentId);
    if (!comment) return res.status(409).json({ error: 'Comment doesn\'t exist.' });
    if(comment.author_id != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    let commentCreated = {
        id: commentId,
    };
    if(content)commentCreated = {...commentCreated, content: content};
    if(status) commentCreated = {...commentCreated, status: active};
    if(!await Comment.save(commentCreated)) return res.status(400).json({ error: 'Error with update of comment.' });

    return res.status(200).json({ 
        message: 'Comment was updated.'
    });
}

export const deleteCommentById = async (req, res) =>{
    const commentId = req.params.id;
    const comment = await Comment.getById(commentId);
    if (!comment)return res.status(409).json({ error: 'Comment doesn\'t exist.' });
    if(comment.author_id != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    if(!await Comment.deleteComment(commentId)) return res.status(400).json({ error: 'Error with delete of comment.' });
    return res.status(200).json({ 
        message: 'Comment was deleted.'
    });
}

export const deleteCommentLike = async (req, res) =>{
    const commLike = req.params.id;
    if(!await Comment.getById(commLike)) return res.status(409).json({ error: 'Comment doesn\'t exist.' });
    const likeToDel = await Like.getById(commLike, "likes_comment", req.user.usid);
    if(likeToDel.author_id != req.user.usid && !req.user.role.includes('Admin')) return res.status(403).json({ error: 'Access denied.' });
    if(!await Like.deleteById(likeToDel.id, "likes_comment")) return res.status(400).json({ error: 'An error while deleting like.' });
    return res.status(200).json({ message: 'Like or dislike was deleted.' });
}
