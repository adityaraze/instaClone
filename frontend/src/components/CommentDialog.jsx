import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import VideoPlayer from "./VideoPlayer";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const dispatch = useDispatch();
  const { selectedPost } = useSelector((state) => state.post);
  const [comment,setComment] = useState();
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost.comments);
    }
  },[selectedPost])
  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
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
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
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
  const data = selectedPost?.image;
  const parts = data?.split("/");
  const containsVideo = parts?.includes("video");
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            
            {containsVideo ? (
              <VideoPlayer post={selectedPost} />
            ) : (
              <img
                className="rounded-sm my-2 w-full aspect-square object-cover"
                src={selectedPost?.image}
              />
            )}
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="post_image"
                      height={35}
                      width={35}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.name}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio Here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full ">
                    Add To Favourites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-[96] ml-5">
              {comment?.map((comment) => (
                <Comment key={comment?._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                  value={text}
                  onChange={changeEventHandler}
                />
                <Button
                  variant="outline"
                  onClick={sendMessageHandler}
                  disabled={!text.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
