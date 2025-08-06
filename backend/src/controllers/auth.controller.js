import User from '../models/User.js'
import jwt from 'jsonwebtoken'
 

export async function signup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
               message:"all fields are required"
           })
        }
        if (password.length < 6) {
            return res.status(400).json({
               message:"password must be at least 6 character"
           })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
             return res.status(400).json({
               message: "invalid email format",
             });
        }
       
        const existinUser = await User.findOne({ email })
        
        if (existinUser) {
            return res.status(400).json({
                message:"Email already exists,please use different email"
            })
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

        const newUser = await User.create({
          fullName,
          email,
          password,
          profilePic:randomAvatar,
        });

        const token = jwt.sign({
            userId: newUser._id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn:'7d'
        })

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 10000,
            httpOnly: true,
            sameSite: 'strict',
            secure:process.env.NODE_ENV==='production'
        })

        res.status(201).json({
            success: true,
            user:newUser
        })
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message:"please try again something went wrong! internal error"
        })
    }
}
export async function login(req, res) {
    
}
export  function logout(req, res) {
    res.send('logout page')
}