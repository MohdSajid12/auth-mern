import express from  "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDb from "./config/mongodb.js";

const app = express();
const port =  process.eventNames.PORT || 3000;

connectDb().then(()=>{
    console.log(`database is connnected successfully`);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.listen(port , ()=>{
    console.log(`server is started at the port :${port}`)
})