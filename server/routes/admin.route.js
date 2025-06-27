const express = require("express")
const adminRouter = express.Router()
const pool = require("../utils/db")
const { logger } = require("../utils/logger")

adminRouter.get("/" , (req,res) => res.send("Admin Route"))

adminRouter.post("/SQL-QUERY" , async (req,res)=>{
    try{
        const {query} = req.body;
        console.log(query)

        const [result] = await pool.query(query)
        res.send({
            success:true,
            data:{
                result
            }
        })
    }catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})

adminRouter.get("/logs" , async(req,res)=>{
    try{
        let page = req.query.page || 0 ;

        const [logs] = await pool.query("SELECT * FROM logs ORDER BY time DESC LIMIT 30 OFFSET ?;", [ page*30 ]);
        const [total] = await pool.query("SELECT COUNT(id) as total FROM logs;");
        
        res.send({
            success:true,
            data:{
                logs,
                page,
                limit:"30",
                total:total[0].total
            }
        })
    }catch(err){
        logger( { message:`An Error occured at GET admin/logs , error:${err.message}` , time:new Date() , ip : req.ip } )
        res.send({
            success:false,
            error:err.message
        })
    }
})

adminRouter.delete("/delete-logs", async (req, res) => {
    try {
        await pool.query(
            `DELETE FROM logs WHERE id IN (${req.body.ids.map(() => '?').join(',')})`,
            req.body.ids
        );

        res.send({
            success: true,
            data: {
                message: "Logs deleted"
            }
        });
    } catch (err) {
        logger({
            message: `An Error occurred at DELETE /admin/delete-logs, requested ids=${JSON.stringify(req.body.ids)}, error: ${err.message}`,
            time: new Date(),
            ip: req.ip
        });
        res.send({
            success: false,
            error: err.message
        });
    }
});

adminRouter.get("/users" , async(req,res)=>{
    try{
        const [ users ] = await pool.query("SELECT * FROM user;")
        res.send({
            success:true,
            data:{
                users:users
            }
        })
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

adminRouter.post("/notify" , async (req,res) => {
    try{
        
    }catch(err){
        res.send({
            success:false,
            error:err.message
        })
    }
})

module.exports = adminRouter;