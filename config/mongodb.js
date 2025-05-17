import mongoose from "mongoose";

const connectDb =  async ()=>{
   await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
}

export default connectDb;