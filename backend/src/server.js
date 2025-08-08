import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
dotenv.config()

const PORT=process.env.PORT
const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)

app.listen(PORT, () => {
    console.log('the server is running on port 5001')
   connectDB()
})