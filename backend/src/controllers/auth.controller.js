import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import {upsertStreamUser} from '../lib/stream.js'
 

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
        
        try {
           await upsertStreamUser({
             id: newUser._id.toString(),
             name: newUser.fullName,
             image: newUser.profilePic || "",
           });  
            console.log(`stream user created for ${newUser.fullName}`)
        }
        catch (e) {
            console.error('Error creating Stream ',e)
        }
       

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
    const { email, password } = req.body;
    try {
       if(!email || !password) return res.status(400).json({message:'all fileds required'})

        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({success:false, message:"invalid email or password"})
        }
        const isPasswordCorrect = await user.matchPassword(password);
        
        if (!isPasswordCorrect) return res.status(401).json('invalid email or password')
        
        
             const token = jwt.sign(
               {
                 userId: user._id,
               },
               process.env.JWT_SECRET_KEY,
               {
                 expiresIn: "7d",
               }
             );

             res.cookie("jwt", token, {
               maxAge: 7 * 24 * 60 * 60 * 10000,
               httpOnly: true,
               sameSite: "strict",
               secure: process.env.NODE_ENV === "production",
             });
        
        res.status(200).json({success:true, user})
    }
    catch (e) {
           console.log(e);
           res.status(500).json({
             success: false,
             message: "please try again something went wrong! internal error",
           });
    }
}
export  function logout(req, res) {
    res.clearCookie('jwt');
    res.status(200).json({
        success: true,
        message:"logout successfuly"
    })
}
export async function onboard(req,res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(401).json({
                message: "all fields are required",
                missingFields: [
                    !fullName && "fullName",!bio&&"bio",!nativeLanguage && "nativeLanguage",!learningLanguage && "learningLanguage",!location && "location"
                ].filter(Boolean)
            })
        }

        const updatedUser=await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded:true
        }, { new: true })
        if (!updatedUser) return res.status(404).json({ message: "user not found" })
        
         try {
           await upsertStreamUser({
             id: updatedUser._id.toString(),
             name: updatedUser.fullName,
             image: updatedUser.profilePic,
           });
           console.log(`stream user updated after onboarding  ${updatedUser.fullName}`);
         } catch (e) {
           console.error("Error creating Stream ", e);
         }
        
        res.status(200).json({
            success:true, user:updatedUser
        })
    }
    catch (e) {
        console.log("error happeing while onboarding user", e)
        res.status(500).json({
          success: false,
          message: "please try again something went wrong! internal error",
        });
    }
   
}