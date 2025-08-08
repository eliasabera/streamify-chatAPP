import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User.js'



export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
               message:'unauthorized -No token provided'
           })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

         console.log("Decoded userId:", decode.userId);

        if (!decode) {
            return res.status(401).json({
              message: "unauthorized -Invalid token",
            });
        }
        const user = await User.findById(decode.userId).select('-password')

        
        if (!user) {
            return res.status(404).json({
              message: "unauthorized -User not found",
            });
        }
        
        req.user = user;
        
        next()
    }
    catch (e) {
        console.log('Error in protectRoute middleware', e) 
        res.status(500).json({
            message:'internal server error'
        })
    }
}
