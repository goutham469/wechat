const express = require("express");
const pool = require("../utils/db");
const generatePassword = require("../utils/generatePassword");
const register_template = require("../templates/register");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");
const login_verification_template = require("../templates/loginWithEmail");
const { logger, SNS_logger, SNS_getLogs } = require("../utils/logger");
const { checkChatInstanceExistence, getChatMessagesWithOtherUserByPagination, createChatInstance, getUserChats, getChatMessagesByChatIdByPagination } = require("../controllers/chat.controller");
const { insertMessage } = require("../controllers/message.controller");
const webPush = require("../utils/webpush");
const { updateProfile } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM user;");
        res.send({
            success: true,
            data: { users }
        });
    } catch (err) {
        res.send({ success: false, error: err.message });
    }
}); 

userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, name } = req.body;

        // check for existing email
        const [emailCheck] = await pool.query("SELECT COUNT(*) AS count FROM user WHERE email = ?", [email]);
        if (emailCheck[0].count > 0) {
            return res.json({ success: false, error: "Email already exists." });
        }

        // check for existing username
        const [usernameCheck] = await pool.query("SELECT COUNT(*) AS count FROM user WHERE username = ?", [username]);
        if (usernameCheck[0].count > 0) {
            return res.json({ success: false, error: "Username already exists." });
        }

        const password = generatePassword();
        const [insertResult] = await pool.query(
            "INSERT INTO user (username, email, password, name) VALUES (?, ?, ?, ?)",
            [username, email, password, name]
        );

        if (insertResult.affectedRows === 1) {
            const html = register_template(username, email, name, password);
            await sendEmail(email, "weChat welcomes you", html);
            return res.json({ success: true, message: "User registered and email sent." });
        } else {
            return res.json({ success: false, error: "Failed to insert user." });
        }

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});
 
userRouter.post("/login", async (req, res) => {
    try {
        const { login_type } = req.query;

        if (login_type === "OAuth") {
            logger( { message:`Login request came via OAuth , user_email = ${req.body.email}` , time:new Date() , ip : req.ip } )
            const [users] = await pool.query("SELECT * FROM user WHERE email = ?", [req.body.email]);
            if (users.length > 0) {
                return res.json({ success: true, data: { user: users[0] } });
            } else {
                return res.json({ success: false, error: "Email not found" });
            }
        } else if (login_type === "email") {

            console.log("email Login request came..." , req.body)
            logger( { message:`Login request came via Email vaerification , user_email = ${req.body.email}` , time:new Date() , ip : req.ip } )

            if( !req.body.email ){
                res.send({
                    success:false,
                    error:"email is needed"
                })
            }else{
                const OTP = generateOTP();
                console.log(`OTP : ${OTP}`)
                logger( { message:`OTP generated for email verification(Login) , OTP=${OTP} ,user_email = ${req.body.email}` , time:new Date() , ip : req.ip } )

                const html = login_verification_template(req.body.email, OTP);
                await sendEmail(req.body.email, "Login Verification", html);
                
                return res.json({ success: true, data: { OTP } });

            }
        } else {
            const { username, password } = req.body;
            const [users] = await pool.query(
                "SELECT * FROM user WHERE username = ? AND password = ?",
                [username, password]
            );
            logger( { message:`Login req came with username(${username})+password(${password})` , time:new Date() , ip : req.ip } )

            if (users.length > 0) {
                return res.json({ success: true, data: { user: users[0] } });
            } else {
                return res.json({ success: false, error: "Invalid credentials." });
            }
        }
    } catch (err) {
        res.send({ success: false, error: err.message });
        logger( { message:`An error occured in the Login process , error=${err.message}` , time:new Date() , ip : req.ip } )
    }
});

userRouter.get("/search" , async (req,res) => {
    try{
        const { query } = req.query;
        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        const [users] = await pool.query("SELECT id,username,profile_pic,online_status FROM user WHERE LOWER(username) LIKE ?  limit ? offset ? ;", [ `%${query}%` , 10 , (page-1)*10 ]);
        res.send({
            success:true,
            data:{
                users:users,
                page:page,
                limit:10
            }
        })
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

userRouter.post("/get-chat" , async (req,res) => {
    try{
        const { u1 , u2 } = req.body;
        logger( { message:`POST /user/get-chat , u1=${u1} u2=${u2}` , time:new Date() , ip : req.ip } )
        const status = await checkChatInstanceExistence( u1 , u2 )
        console.log(status);

        if( status ){
            const messages = getChatMessagesWithOtherUserByPagination( u1 , u2 );

            res.send( { 
                success:true,
                data:{
                    message:"chat already exists",
                    chat_messages:messages
                }
            } )
        }else{ 
            const chatInstance = await createChatInstance( [ u1 , u2 ] );
            logger( { message:`POST /user/get-chat , u1=${u1} u2=${u2} , new chat Instance created , creation_status :${JSON.stringify(chatInstance)}` , time:new Date() , ip : req.ip } )

            if( chatInstance.success ){
                logger( { message:`POST /user/get-chat , u1=${u1} u2=${u2} , new chat Instance created` , time:new Date() , ip : req.ip } )
                res.send({
                    success:true,
                    message:"new chat Instance created."
                })
            }else{
                logger( { message:`POST /user/get-chat , u1=${u1} u2=${u2} , new chat Instance creation Failed` , time:new Date() , ip : req.ip } )
                res.send({
                    success:false,
                    error:chatInstance.error
                })
            }
        }

    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

userRouter.get("/get-all-chats" , async(req,res) => {
    try{
        const { userId } = req.query;
        logger( { message:`GET user/get-all-chats , userId=${req.query.userId}` , time:new Date() , ip : req.ip } )
        const result = await getUserChats( userId )
        res.send(result)
    }catch(err){
        logger( { message:`GET user/get-all-chats , Error occured , error:${err.message}` , time:new Date() , ip : req.ip } )
        res.send({
            success:false,
            error:err.message
        })
    }
})

userRouter.get("/get-messages" , async (req,res)=>{
    try{
        res.send(
            await getChatMessagesByChatIdByPagination( req.query.chatId , req.query.page || 0 )
        )
        logger( { message: `getChatMessagesByChatIdByPagination( chatId:${req.query.chatId} , page:${req.query.page}) ` , time:new Date() , ip : req.ip } )
    }catch(err){
        res.send({
            success:false,
            error:err.message
        }) 
    }
})

userRouter.post("/send-message" , async (req,res) => {
    try{
        const { chatId , sender , message } = req.body;
        console.log(req.body)
        res.send(
            await insertMessage( chatId , sender , message )
        )
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

userRouter.post("/subscribe", async (req, res) => {
    try {
        const { subscription, userId } = req.body;

        const [userResult] = await pool.query("SELECT sns_subscriptions FROM user WHERE id = ?" , [ userId ] );
        
        const user = userResult[0];
        const currentSubs = user?.sns_subscriptions ? JSON.parse(user.sns_subscriptions) : [];

        const subscriptions = new Set(currentSubs);
        subscriptions.add(subscription);

        await pool.query( "UPDATE user SET sns_subscriptions = ? WHERE id = ?", [JSON.stringify([...subscriptions]), userId] );

        const payload = JSON.stringify({
            title:"Welcome to WeChat",
            message:"your new messaging platform...",
            type:"welcomeMessage"
        })

        
        try{
            await webPush.sendNotification( subscription , payload )

            await SNS_logger( {
            receiver:userId,
            sender:0,
            message:"your new messaging platform...",
            time:new Date(),
            ip:"SYSTEM IP",
            subscription:subscription.endpoint,
            payload:payload
          } )

        }catch(err){
            console.log(err)
        }

        res.send({ success: true });

    } catch (err) {
        console.log(err);

        res.send({
            success: false,
            error: err.message
        });
    }
});

userRouter.put("/update-profile" , async (req,res) => {
    try{
        const { userId , form } = req.body;
        const result = await updateProfile( userId , form )
        res.send(result)
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})


userRouter.get("/get-my-notifications" , async (req,res)=>{
    try{
        const {userId} = req.query;
        console.log(`userID: ${userId} is requesting notifications`);

        const result = await SNS_getLogs( { userId:userId } )
        res.send(result)
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
    
})


module.exports = userRouter;