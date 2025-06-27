const express = require("express")
const app = express()
const CORS = require("cors")
require("dotenv").config()
const { Server } = require("socket.io")
const http = require("http")
const userRouter = require("./routes/user.route")
const adminRouter = require("./routes/admin.route")
const { logger } = require("./utils/logger")
const { insertMessage } = require("./controllers/message.controller")
const { updateUserAsOnline, updateUserAsOffline } = require("./controllers/user.controller")
const { SNS_message_service } = require("./utils/SNS_service")
const { default: webPush } = require("./utils/webpush")

const { PORT , FORNTEND_URL } = process.env;
const server = http.createServer( app )

const io = new Server( server , {
    cors: { origin:'*' }
} ) 
 

const online_users = []; // Structure: { user_id , socket_id }

io.on("connection", (socket) => {
    console.log("New connection: " + socket.id);
    logger( { message:`new socket connection added ,Socket_id = ${socket.id}` , time:new Date() , ip : socket.handshake.address } )

    // Assume frontend emits "add-user" with username after auth
    socket.on("add-user", async (user_id) => {
        const existence = online_users.find( obj => obj.user_id == user_id );
        await updateUserAsOnline( user_id )

        if(!existence){
            online_users.push({ user_id:user_id , socket_id: socket.id });
            console.log(`${user_id} added to online_users`);
            logger( { message:`socket connection established ,Socket_id = ${socket.id} , user_id = ${user_id}` , time:new Date() , ip : socket.handshake.address } )
        }else{
            console.log(`${user_id} already exists in online_users`);
            logger( { message:`socket connection re-established ,Socket_id = ${socket.id} , user_id = ${user_id}` , time:new Date() , ip : socket.handshake.address } )
            
            existence.socket_id = socket.id;
        }
    });
 
    socket.on("send-message", async (data) => {
        const { receiver, message, sender, chatId } = data;
        logger( { message:`new message came to send .Data receiver: ${receiver} , message: ${message} ,sender:${sender} ,chatId:${chatId}` , time:new Date() , ip : socket.handshake.address } )

        const user = online_users.find( u => u.user_id === receiver );

        // Save to DB (do it regardless of online status)
        try {
             insertMessage( chatId , sender , message )
        } catch (err) {
            console.error("DB Insert Failed: ", err.message);
            logger( { message:`Some error occured while inserting message to DB , error=${err.message} ,Socket_id = ${socket.id}` , time:new Date() , ip : socket.handshake.address } )
        } 
    
        if (user) {
            // Receiver is online
            io.to(user.socket_id).emit("update", data);
        } else {
            // Receiver is offline
            await SNS_message_service( receiver, message, sender , socket.handshake.address );
            logger( { message:`SNS service is called for receiver: ${receiver} , message: ${message} ,sender:${sender}.` , time:new Date() , ip : socket.handshake.address } )
        }
    });

    socket.on("disconnect", async () => {
        console.log("User disconnected: " + socket.id);
        const index = online_users.findIndex(u => u.socket_id == socket.id);
        console.log(index)

        if (index != -1) {
            await updateUserAsOffline( online_users[index].user_id )
            online_users.splice(index, 1);
            logger( { message:`A user disconnected socketId=${socket.id}` , time:new Date() , ip : socket.handshake.address } )
        }
    });
});



app.use( CORS( { origin: [ FORNTEND_URL , "https://wechat.iamgoutham.in" ] } ) )
app.use( express.json() )

// routes
app.get("/" , (req,res)=> res.send("chat app server Running ..."))
app.get("/online-users" , ( req,res ) => res.send( online_users ) )

app.use("/user" , userRouter);
app.use("/admin" , adminRouter);

console.log( new Date() )
logger({ message:"server started" , time:new Date() , ip:"root" })

server.listen( PORT , () => console.log("Server running on PORT " + PORT ) ) 