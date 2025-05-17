import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req,res)=>{
      const {name,email,password} = req.body;
        if(!name || !email || !password){        
            return res.json({success:false,message:'Missing details'})
        }
        try {
            const existingUser =  await userModel.findOne({email});
             if(existingUser){
                 return res.json({success:false ,message :"User already exists"});
             }
            const hasedPassword = await bcrypt.hash(password,10);
            const user = new userModel({name ,email ,password:hasedPassword});
            await user.save();
            
            const token = jwt.sign ({id :user._id} ,process.env.JWT_SECRET ,{expiresIn: '7d'}); 
            //only http cookie access the cookie

            // httpOnly: true
            // Iska matlab: JavaScript se cookie access nahi ho sakti.
            // Security ke liye hota hai, taki koi hacker JS se token na chura le.

            // secure: process.env.NODE_ENV === 'production'
            // Ye bolta hai: Agar app production (live site) pe hai, toh cookie sirf HTTPS connection pe hi send hogi (secure).
            // Development mein (localhost pe) HTTP bhi allowed hai.

            //  sameSite: production ? 'none' : 'strict'
            //  Production mein 'none' ka matlab: cookie ko cross-site requests mein bhi bhejne do (e.g., if frontend and backend are on different domains).
            //  Development mein 'strict': cookie sirf same site se bheji jaye — more secure.
            res.cookie('token',token,{
                httpOnly:true,
                secure :process.env.NODE_ENV === 'production',
                sameSite :process.env.NODE_ENV === 'production' ? 'none' :  'strict',
                maxAge :7 * 24 * 60 * 60 * 1000
            });
          return res.json({success:true});
        } catch(error){
            res.json ({success :false , message : error.message});
        }
}



export const login =  async (req,res)=>{
      const {email , password} = req.body;
      if(!email || !password){
        return res.json({success:false,message :'Email and password is required'})
      }
      try{
        const user = await userModel.findOne({email});
           if(!user){
             return res.json({success:false , message :'invalid email'});
           }
        const isMatch = await bcrypt.compare(password,user.password);
           if(!isMatch){
             return res.json({success:false , message :'invalid password'});
           }
         
        const token = jwt.sign ({id :user._id} ,process.env.JWT_SECRET ,{expiresIn: '7d'});
         res.cookie('token',token,{
                httpOnly:true,
                secure :process.env.NODE_ENV === 'production',
                sameSite :process.env.NODE_ENV === 'production' ? 'none' :  'strict',
                maxAge :7 * 24 * 60 * 60 * 1000
            });
         
            return res.json({success:true});
 
      }catch(error){
         return res.json({success:false ,message :error.message});
      }
}


export const logout =  async ()=>{
    try{
       res.clearCookie('token',{
          httpOnly:true,
                secure :process.env.NODE_ENV === 'production',
                sameSite :process.env.NODE_ENV === 'production' ? 'none' :  'strict',
       })
       return res.json({success:true,message :"Logged Out"});
    }
    catch(error)
    {
        return res.json({success:false , message : error.message})
    }
}