import express from 'express';
import { getRecommendedUser, getMyFriends } from "../controllers/user.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();
router.use(protectRoute)

router.get('/',getRecommendedUser)
router.get('friends',getMyFriends)



export default router