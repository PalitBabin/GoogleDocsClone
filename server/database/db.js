import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const Connection = async(URL)=>{
    try{
        await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true});
        console.log('Database successfully connected.');
    }catch(error){
        console.log('Error while connecting with the database',error);
    }
}

export default Connection;