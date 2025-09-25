
import jwt from 'jsonwebtoken' 

const generateAccessToken =async(userId,role) => {

const token =await jwt.sign({id:userId,role},process.env.ACCESS_TOKEN,
    {expiresIn:'5h'}
)
return token

  
}

export default generateAccessToken