import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import LOGO from "../assets/th.jpeg"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth);
    const[input,setInput] = useState({
        email:"",
        password:""
    })
    const [loading,setLoading] = useState(false);
    const changeHandler = (e) =>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const loginHandler = async(e) =>{
        setLoading(true);
        e.preventDefault();
        console.log(input)
        try{
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            console.log("res",res)
            if(res.data.success){
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                email:"",
                password:""
                })
            }
        }
        catch(err){
            console.log(err);
            toast.error(err.response?.data.message);
        }
        setLoading(false);
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
            <div className="flex items-center justify-center gap-2">
            <img src={LOGO} className="h-[35px]" />
            <h1 className="my-3 text-3xl font-sans">Instagram</h1>
          </div>
            <p className='text-sm text-center'>Login To Explore Again</p>
        </div>
        <div>
            <Label className='font-medium'>Email</Label>
            <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeHandler}
                className='focus-visible:ring-transparent my-2'
            />
        </div>
        <div>
            <Label className='font-medium'>Password</Label>
            <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeHandler}
                className='focus-visible:ring-transparent my-2'
            />
        </div>
        {
            loading? (
                <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    Please Wait
                </Button>
            ):(<Button type='submit'>Login</Button>)
        }
        <span className='text-center'>Does Not Have An Account ? <Link to="/signup" className='text-blue-400'>Signup</Link></span>
        </form>
    </div>
  )
}

export default Login