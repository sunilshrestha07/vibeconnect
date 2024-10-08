import dbConnect from "@/lib/db";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {user,media,discription} = await request.json()
        if(!user || !media.url || !media.type ){
            return NextResponse.json({message:"all filds are required"},{status: 404})
        }

        //check if the user exist or not

        const userExist = await User.findById(user)
        if(!userExist){
            return NextResponse.json({message:"user not fould"},{status: 404})
        }

        const post = new Post({
            user,
            discription,
            media:{
                url: media.url,
                type: media.type,
            }
        })

        await post.save()
        return NextResponse.json({message:"Successfully created post",post:post},{status: 200})
    } catch (error) {
       return NextResponse.json({message:`Error creating post ${error}`},{status: 500}) 
    }
}


//getting all the post
export async function GET(request: Request) {
    await dbConnect()
    try {
        const allpost = await Post.find()
        .populate("user",'userName avatar')
        .sort({createdAt:-1})
        if(allpost.length === 0){
            return NextResponse.json({message:"No post found"},{status: 404})
        }
        return NextResponse.json({message:"All the post are:",allpost:allpost},{status: 200})
    } catch (error) {
       return NextResponse.json({message:`Error ting all post ${error}`},{status: 500}) 
    }
    
}