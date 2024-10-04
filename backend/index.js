const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const dataBase = require("./config/databse");
const userRoutes = require("./routes/User");
const postRoutes = require("./routes/Post");
const messageRoutes = require("./routes/Message")
const fileUpload = require('express-fileupload');
const { cloudinaryConnect } = require("./config/cloudinary");
const { urlencoded } = require("body-parser");
const {app,server} = require("./socket/socket.js")
const path = require("path")


require("dotenv").config();

__dirname = path.resolve();



// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from backEnd",
//         success:true
//     })
// })

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
// Enable files upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/' // temporary directory for file storage
}));
cloudinaryConnect();


const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,
}

app.use(cors(corsOptions));

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/message",messageRoutes);

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

server.listen(PORT,()=>{
    dataBase.connect()
    console.log(`Server is running on the port no ${PORT}`)
})