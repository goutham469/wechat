import { useSelector } from 'react-redux'
import { getInitialState } from '../redux/getInitialState';

const { VITE_SERVER_URL } = import.meta.env;


async function login_with_Google_OAUTH(email)
{
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/login?login_type=OAuth`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email})
        })

        return await response.json()
    }catch(err){
        report_error(err)
        return err
    }
}

async function getOTP(email){
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/login?login_type=email`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"email":email})
        })

        return await response.json()
    }catch(err){
        report_error(err);
        return err
    }
} 

async function login_with_username(form){
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(form)
        })
        return await response.json()

    }catch(err){
        report_error(err)
        return err
    }
}

async function SQLQuery( form ) {

    const response = await fetch(`${VITE_SERVER_URL}/admin/SQL-QUERY`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(form)
    })
    return await response.json()
}

async function getLogs( page )
{
    try{
        const result = await fetch(`${VITE_SERVER_URL}/admin/logs?page=${page}`)
        return await result.json();
    }catch(err){
        return err.message
    }
}
async function deleteLogs( ids )
{
    try{
        const result = await fetch(`${VITE_SERVER_URL}/admin/delete-logs`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ids:ids})
        })
        return await result.json();
    }catch(err){
        return err.message
    }
}

function LogOut()
{
    localStorage.clear();
    window.location.href = "/login";
}

async function getAllUsers(){
    try{
        const response = await fetch(`${VITE_SERVER_URL}/admin/users`)
        return await response.json()
    }catch(err){
        return err.message
    }
}

async function searchUser( query )
{
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/search?query=${query}`)
        return await response.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function loadChat(params) {
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/get-chat`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                u1:params.u1,
                u2:params.u2
            })
        })
        return await response.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}
 
async function getUserChats(){
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/get-all-chats?userId=${ getInitialState("user").id }`)
        return await response.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function getMessages( chatId , page ) {
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/get-messages?chatId=${chatId}&page=${page}`)
        return await response.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function sendMessage( chatId , sender , message ){
    try{
        const response = await fetch(`${VITE_SERVER_URL}/user/send-message`,{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({
                chatId,
                sender,
                message
            })
        })
        return await response.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

async function update_profile( user_id , form ) {
    try{
        const result = await fetch(`${VITE_SERVER_URL}/user/update-profile`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(form)
        })
        return await result.json()
    }catch(err){
        return {
            success:false,
            error:err.message
        }
    }
}

// error reporting system
async function report_error(error)
{
    try{
        let ip = await fetch('https://geolocation-db.com/json/');
        ip = await ip.json();

        const response = await fetch(`${VITE_SERVER_URL}/system/report-error?src=user-system`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"error":error , "ip":ip.IPv4 })
        })
    }catch(err){
        console.log("error reporting failed , ",err)
    }
}

 

export const API = { report_error , login_with_Google_OAUTH , getOTP , login_with_username , SQLQuery , LogOut , getLogs , deleteLogs , getAllUsers , searchUser , loadChat , getUserChats , getMessages , sendMessage , update_profile };