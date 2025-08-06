import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
       const con= await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connected",con.connection.host)
    }
    catch (e)
    {
        console.error("failed to connect to Database");
        process.exit(1)
    }
}