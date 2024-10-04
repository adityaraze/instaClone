const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { getRecieverSocketId, io } = require("../socket/socket.js");

exports.sendMessage = async(req,res) =>{
    try{
        const senderId = req.id;
        const recieverId = req.params.id;
        const {textMessage:message} = req.body;
        // console.log("Message",message)
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        });

        // establish the conversation if not started yet
        // console.log("Conver = ",conversation)
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId,recieverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            message
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
         }

         await Promise.all([conversation.save(),newMessage.save()]);

         // implement socket io for real time data transfer

         const recieverSocketId = getRecieverSocketId(recieverId);

         if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage);
         }

         return res.status(200).json({
            success:true,
            newMessage,
         });
    }
    catch(err){
        console.log("Error in sending the message",err.message);
    }
}

exports.getMessage = async(req,res) =>{
    try{
        const senderId = req.id;
        const recieverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        }).populate('messages');;

        if(!conversation){
            return res.status(200).json({
                success:true,
                messages:[]
            })
        }

        return res.status(200).json({
            success:true,
            messages:conversation?.messages
        })

    }
    catch(err){
        console.log(err)
    }
}