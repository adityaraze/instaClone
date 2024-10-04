const Comments = require("../models/Comments");
const Post = require("../models/Post");
const User = require("../models/User");
const { getRecieverSocketId, io } = require("../socket/socket.js");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.addNewPost = async(req,res) =>{
    try{
        const {captions} = req.body;
        const photo = req.files.photo
        const authorId = req.id;
        if(!photo){
            return res.status(400).json({
                success:false,
                message:"Please provide image to post"
            })
        }

        console.log("photo = ", photo);

        const image = await uploadImageToCloudinary(
            photo, // Pass tempFilePath here
            process.env.FOLDER_NAME,
            1000,
            1000
        );
        console.log("image", image);

        const post = await Post.create({
            captions,
            image:image.secure_url,
            author:authorId
        })

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path:'author',select:'-password'});

        return res.status(200).json({
            success:true,
            message:"New Post Added",
            post,
        })
    }
    catch(err){
        console.log("Error in adding a new post ",err.message);
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'name profilePicture'
            })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'name profilePicture'
                }
            });

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (err) {
        console.log("Error in getting all the posts", err.message);
        return res.status(500).json({
            success: false,
            message: "Error in getting all the posts",
            error: err.message
        });
    }
};

exports.getUserPost = async(req,res) =>{
    try{
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'name ,profilePicture'
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'name profilePicture'
            }
        });

        return res.status(200).json({
            success:true,
            posts
        })
    }
    catch(err){
        console.log("error in getting perticular post",err.message)
    }
}

exports.likePost = async(req,res) =>{
    try{
        const likeKrneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found which is going to liked"
            })
        }

        await post.updateOne({$addToSet:{likes:likeKrneWaleUserKiId}});
        /// addToSet -> Ek bar hi like krne dega

        await post.save();

        // Implemeting socket io for real time notification
        const user = await User.findById(likeKrneWaleUserKiId).select('name profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== likeKrneWaleUserKiId){
            // emit a notifiaction
            console.log(user);
            const notification = {
                type:'like',
                userId:likeKrneWaleUserKiId,
                userDetails:user,
                postId,
                message:`Your post was liked by ${user?.name}`
            }

            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({
            success:true,
            message:"Post liked Successfully",
        })
    }
    catch(err){
        console.log("error in liking the post ",err.message);
    }
}

exports.dislikePost = async(req,res) =>{
    try{
        const dislikeKrneWaleUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found which is going to disliked"
            })
        }

        await post.updateOne({$pull:{likes:dislikeKrneWaleUserKiId}});
        /// addToSet -> Ek bar hi like krne dega

        await post.save();

        // Implemeting socket io for real time notification
        const user = await User.findById(dislikeKrneWaleUserKiId).select('name profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId !== dislikeKrneWaleUserKiId){
            // emit a notifiaction
            const notification = {
                type:'dislike',
                userId:dislikeKrneWaleUserKiId,
                userDetails:user,
                postId,
                message:`Your post was disliked by ${dislikeKrneWaleUserKiId.name}`
            }

            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }
        return res.status(200).json({
            success:true,
            message:"Post disliked Successfully",
        })
    }
    catch(err){
        console.log("error in liking the post ",err.message);
    }
}

exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentAuthorId = req.id; // Renamed to something more readable

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Write something to comment"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Create the comment
        const comment = await Comments.create({
            text,
            author: commentAuthorId,
            post: postId
        });

        // Fetch the comment with populated fields
        const populatedComment = await Comments.findById(comment._id).populate({
            path: 'author',
            select: 'name profilePicture'
        });

        // Push the comment to the post's comments array
        post.comments.push(comment._id);
        await post.save();

        const user = await User.findById(commentAuthorId).select('name profilePicture');
        const postOwnerId = post.author.toString();

            const notification = {
                type:'comment',
                userId:commentAuthorId,
                userDetails:user,
                postId,
                comment,
                message:`Your post was disliked by ${user.name}`
            }

            const postOwnerSocketId = getRecieverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);


        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (err) {
        console.log("Error in adding the comment", err.message);
        return res.status(500).json({
            success: false,
            message: "Error in adding the comment",
            error: err.message
        });
    }
};

exports.getCommentOfPost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const comments = await Comments.find({post:postId}).populate('author','name , profilePicture');

        if(!comments){
            return res.status(401).json({
                success:false,
                message:"No Comments Found For This Post",
            })
        }

        return res.status(200).json({
            success:true,
            comments,
            message:"Post Comments Successfully"
        })
    }
    catch(err){
        console.log("Error in Getting Post Comments",err.message);
    }
}

exports.deletePost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not Found to delete"
            })
        }

        // check vhi user post delete kr rha ho jiska vo post hai
        if(post.author.toString() !== authorId){
            return res.status(400).json({
                success:false,
                message:"Apni Post Delete Kro Dusro Ki Nhi",
            })
        }

        await Post.findByIdAndDelete(post);
        // remove post id from user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id=>id.toString()!==postId);
        await user.save();

        //delete associated comment

        await Comments.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:"Post Deleted Successfully"
        })
    }
    catch(err){
        console.log("Error in deleting the post",err.message);
    }
}

exports.bookmarkPost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                message:"post not found",
                success:true
            })
        }

        const user = await User.findById(authorId);
        if(user.bookmarks?.includes(post._id)){
          // already book marked -> remove from bookmark  
          await user.updateOne({$pull:{bookmarks:postId}})
          await user.save();

          return res.status(200).json({
            success:true,
            type:"unsaved",
            message:"Removed from bookmark successfully"
          });
        }
        else{
            // book mark me add krdo
        await user.updateOne({$addToSet:{bookmarks:postId}})
        await user.save();

          return res.status(200).json({
            success:true,
            type:"saved",
            message:"Post bookmarked successfully"
          });
        }
    }
    catch(err){
        console.log("Error in bookmarking the post",err.message);
    }
}