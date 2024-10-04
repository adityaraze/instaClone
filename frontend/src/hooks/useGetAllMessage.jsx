import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((state)=>state.auth)
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`https://instaclone-7ums.onrender.com/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                // console.log("Resoooooo",res);
                if (res.data.success) { 
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser]);
};
export default useGetAllMessage;