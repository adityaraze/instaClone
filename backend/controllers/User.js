// const getDataUri = require('../config/datauri.js');
const bcrypt = require("bcryptjs")
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Post = require("../models/Post");
require('dotenv').config()
exports.register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;
        console.log(name,email,password)
        if(!name || !email || !password){
            return res.status(401).json({
                success:false,
                message:"Something is missing"
            })
        }
        const user = await User.findOne({email});
        console.log(user);
        if(user){
            return res.status(401).json({
                success:false,
                message:"User Already Registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(200).json({
            success:true,
            message:"Account Created Successfully"
        })
    }
    catch(err){
        console.log("Error",err.message);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error "
        })
    }
}

exports.login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Something is missing , please check"
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"incorrect Email Or Password",
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"Password Is Incorrect"
            })
        }

        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

        const populatedPosts = await Promise .all(
            user.posts.map(async (postId)=>{
                const post = await Post.findById(postId);
                if(post?.author?.equals(user._id)){
                    return post
                }
                return null;
            })
        )
        user = {
            _id:user._id,
            name:user.name,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts,

        }

        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            success:true,
            message:`Wellcome Back ${user.name}`,
            user
        });
    }
    catch(err){
        console.log("Error in loggin in ",err.message)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })
    }
}

exports.logout = async(_,res) =>{
    try{
        return res.cookie("token","",{maxAge:0}).json({
            success:true,
            message:"Logged Out Successfully"
        });
    }
    catch(err){
        console.log("Error in logging out");
    }
}

exports.getProfile = async(req,res) =>{
    try{
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success:true,
        });
    }
    catch(err){
        console.log("Error in getting profile",err);
    }
}

exports.editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;

        // Check if the displayPicture exists
        // const displayPicture = req.files.displayPicture 
        // Jab Postman se call krna tb uper wali line chalana
        // forntend ki api call ke liye ye chalao
        const displayPicture = req.files.displayPicture 


        console.log("displayPicture = ", displayPicture);

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update bio and gender if present
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        // If displayPicture exists, upload it to Cloudinary
        if (displayPicture) {
            const image = await uploadImageToCloudinary(
                displayPicture, // Pass tempFilePath here
                process.env.FOLDER_NAME,
                1000,
                1000
            );
            console.log("failed in upitc")
            console.log("image", image);
            user.profilePicture = image.secure_url;
        }

        // Save updated user profile
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile Edited Successfully",
            user
        });
    } catch (err) {
        console.log("Error in editing profile", err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};


exports.getSuggestedUsers = async(req,res) =>{
    try{
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(404).json({
                success:false,
                message:"Currently do not have enough users"
            })
        }
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })
    }
    catch(err){
        console.log("Error in getting suggested users",err);
    }
}

exports.followOrUnfollow = async(req,res) =>{
    try{
        const followKarneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if(followKarneWala === jiskoFollowKrunga){
            return res.status(400).json({
                success:false,
                message:"You can not follow/unfollow yourself"
            })
        }

        const user = await User.findById(followKarneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);
        if(!user || !targetUser){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        // mai check krunga ki follow krna hai ki unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if(isFollowing){
            // unfollow krenge
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$pull:{followers:followKarneWala}})
            ]) 

            return res.status(200).json({
                success:true,
                message:"Unfollow Successfully"
            })
        }
        else{
            // follow krna hai
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$push:{followers:followKarneWala}})
            ])

            return res.status(200).json({
                success:true,
                message:"Follow Successfully"
            })
        }
    }
    catch(err){
        console.log("Error in follow/unfollow",err.message)
    }
}