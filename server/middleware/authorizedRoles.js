export function authorizedRoles(...roles){
    return(req,res,next)=>{
        if(!roles.includes(req.userRole)){
            return res.status(400).json({
                message:"Unauthorized Access",
                ssuccess:false,
                error:true,
            })
        }
        next()
    }
}