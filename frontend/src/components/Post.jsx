import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import img from "../assets/banner.png";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import VideoPlayer from "./VideoPlayer";
const Post = ({ post }) => {
  const data= post?.image;
  const parts = data?.split('/');
  const containsVideo = parts.includes("video");
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        // apne post ko update krna hai
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Error in liking the post", error.message);
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log("Error in commenting the post", error.message);
      toast.error(error.response.data.message);
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      const updatedPostData = posts.filter(
        (postItem) => postItem._id !== post._id
      );
      dispatch(setPosts(updatedPostData));
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in deleting post", error.message);
      toast.error(error.response.data.message);
    }
  };
  const bookmarkHandler = async() =>{
    try{
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`,{withCredentials:true});
      if(res.data.success){
        toast.success(res.data.message);
      }
    }
    catch(error){
      console.log(error.message);
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author.profilePicture}
              alt="post_image"
              width={30}
              height={30}
              className="rounded-full object-fit"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
          <h1>{post?.author?.name}</h1>
          {user?._id === post?.author._id && <Badge varient="secondary">author</Badge>} 
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author?._id !== user?._id && <Button varient="ghost" className="cursor-pointer w-fit ">
              unFollow
            </Button>
            }
            <Button varient="ghost" className="cursor-pointer w-fit  ">
              Add To Favourite
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                varient="ghost"
                onClick={deletePostHandler}
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
        
      </div>
      {
        containsVideo ? (<VideoPlayer post={post}/>) : (<img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
      />)
      }

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"24"}
              className="cursor-pointer text-red-600"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike} Likes</span>
      <p>
        <span className="font-medium mr-2">{post?.author?.name}</span>
        {post?.captions}
      </p>
      {
        comment?.length > 0 && <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all {comment?.length} comments
      </span>
      }
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
