import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSideBar = () => {
  const {user} = useSelector((state)=>state.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            alt="post_image"
            width={30}
            height={30}
            className="rounded-full object-fit"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm"><Link to={`/profile/${user?._id}`}>{user?.name}</Link></h1>
          <span className="text-gray-600 text-sm">{user?.bio || "Bio Here..."}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  );
};

export default RightSideBar;
