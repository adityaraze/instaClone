import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((state) => state.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;
  const [activeTab, setActiveTab] = useState("POST");
  const handelTabChange = (tab) => {
    setActiveTab(tab);
  };
  const displayedPost =
    activeTab === "POST" ? userProfile?.posts : userProfile?.bookmarks;
  
  // const followUnfollow = async() =>{
  //   try{
  //     const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`,{withCredentials:true});
  //     if(response.data.success){
  //       toast.success(res.data.message);
  //     }
  //   }catch(error){
  //     console.log(error.message)
  //   }
  // }
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2 ">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32 ">
              <AvatarImage
                src={userProfile?.profilePicture}
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.name}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  {" "}
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {userProfile?.followers?.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Badge variant="secondary" className="w-fit">
                  <AtSign />
                  <span className="pl-1">{userProfile?.name}</span>
                </Badge>
                <span className="font-semibold">
                  {userProfile?.bio || "Bio Here..."}
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center gap-10 justify-center text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "POST" ? "font-bold" : ""
              }`}
              onClick={() => handelTabChange("POST")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "REELS" ? "font-bold" : ""
              }`}
              onClick={() => handelTabChange("REELS")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "SAVED" ? "font-bold" : ""
              }`}
              onClick={() => handelTabChange("SAVED")}
            >
              SAVED
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  {post?.image?.split("/").includes("video") ? (
                    <VideoPlayer post={post} />
                  ) : (
                    <img
                      className="rounded-sm my-2 w-full aspect-square object-cover"
                      src={post?.image}
                    />
                  )}
                  <div className="absolute rounded-sm inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
