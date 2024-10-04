import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((state) => state.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested For You</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return ( 
          <div key={user._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user._id}`}>
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
              <div className="w-[200px]">
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user._id}`}>{user?.name}</Link>
                </h1>
                <span className="w-1/2 text-gray-600 text-sm">
                  {user?.bio || "Bio Here..."}
                </span>
              </div>
            </div>
            <span className="text-[#3bADF8] font-bold cursor-pointer hover:text-[#174969]">Follow</span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
