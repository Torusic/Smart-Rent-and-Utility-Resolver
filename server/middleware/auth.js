import jwt from 'jsonwebtoken'
const auth = async(req,res,next) => {
    try {
       const token=req.cookies?.accessToken||req?.headers?.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).json({
                message:"Provide token",
                error:true,
                success:false
            })
        }
        const decode=await jwt.verify(token, process.env.ACCESS_TOKEN)
        console.log("Decoded token:", decode);

        if(!decode){
            return res.status(401).json({
                message:"Unauthorizaed access due to Invalid token",
                error:true,
                success:false
            })
        }
        req.userId=decode.id
        req.userRole = decode.role;
        next()
        console.log("Decoded token:", decode);

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
 
  
}

export default auth
