import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import LOGO from "../assets/th.jpeg"
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
const LeftSidebar = () => {
    const {user} = useSelector((state)=>state.auth);
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    console.log("user",user)
    const navigate = useNavigate();
    const {likeNotification} = useSelector(store=>store.realTimeNotification);
    const sidebarItems = [
      { icon: <Home />, text: "Home" },
      { icon: <Search />, text: "Search" },
      { icon: <TrendingUp />, text: "Explore" },
      {icon:<MessageCircle/>,text:"Messages"},
      { icon: <Heart />, text: "Notifications" },
      { icon: <PlusSquare />, text: "Create" },
      {
        icon: (
          <Avatar>
            <AvatarImage src={user?.profilePicture} height={35} width={35} className='rounded-full'/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        text: "Profile",
      },
      { icon: <LogOut />, text: "Logout" },
    ];
    const logoutHandler = async() =>{
        try{
            const res = await axios.get("https://instaclone-7ums.onrender.com/api/v1/user/logout",{withCredentials:true});
            if(res.data.success){
              dispatch(setAuthUser(null))
                navigate("/login");
                toast.success(res.data.message);
            }
        }
        catch(err){
            toast.error(err.response.data.message);
        }
    }
    const sidebarHandler = (bar) =>{
        if(bar === "Logout"){
            logoutHandler();
        }else if(bar === "Create"){
          setOpen(true);
        }else if(bar === "Profile"){
          navigate(`/profile/${user?._id}`);
        }else if(bar === "Home"){
          navigate("/")
        }else if(bar === "Messages"){
          navigate("/chat")
        }
    }
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
       <div className="flex items-center justify-evenly"> 
       <img src={LOGO} className="h-[35px]"/>
       <h1 className="my-3 text-3xl font-sans">Instagram</h1>
       </div>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div key={index}
              onClick={()=>sidebarHandler(item.text)}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
                {
                  item.text === 'Notifications' && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                      <Button size='icon' className='rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600'>{likeNotification.length}</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {
                            likeNotification.length === 0 ? (<p>No new notifiactions</p>):(
                              likeNotification.map((notification)=>{
                                return (
                                  <div key={notification.userId} className="my-5 flex items-center gap-2">
                                  <Avatar>
                                    <AvatarImage src={notification.userDetails?.profilePicture} 
                                      className="h-[35px] w-[32px] rounded-full object-cover"
                                    />

                                  </Avatar>
                                  {
                                    notification.type === 'comment' ?(<p className="text-sm"><span className="font-bold">{notification.userDetails?.name}</span> commented <span className="font-semibold">{`"${notification.comment?.text}"`}</span> on your post. </p>) :(
                                      <p className="text-sm"><span className="font-bold">{notification.userDetails?.name}</span> liked your post. </p>
                                    )
                                  }
                                  </div>
                                )
                              })
                            )
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) 
                }
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen = {setOpen}/>
    </div>
    
  );
};

export default LeftSidebar;
