import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import LOGO from "../assets/th.jpeg"
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const {user} = useSelector(state=>state.auth);

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(input);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("res", res);
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data.message);
    }
    setLoading(false);
  };
  useEffect(()=>{
    if(user){
        navigate("/");
    }
},[])
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <div className="flex items-center justify-center gap-2">
            <img src={LOGO} className="h-[35px]" />
            <h1 className="my-3 text-3xl font-sans">Instagram</h1>
          </div>
          <p className="text-sm text-center">Signup To Explore Instagram</p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            type="text"
            name="name"
            value={input.username}
            onChange={changeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Already Have An Account ?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
