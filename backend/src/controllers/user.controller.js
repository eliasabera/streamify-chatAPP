import User from "../models/User.js";


export async function getRecommendedUser(req,res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
   
        const recommendedUser = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { $id: { $nin: currentUser.friends } },
                {isOnboarded:true}
           ]
        })

        res.status(200).json(recommendedUser)


    
   } catch (error) {
        console.log(error)
        res.status(500).json({message:'something wrong! internal server error'})
   }    
}
export async function getMyFriends(params) {
    
}
