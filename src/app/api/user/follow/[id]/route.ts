import dbConnect from "@/lib/db";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function PUT(request: Request,{params}:any) {
    await dbConnect()
    const id = await params.id
    const {followingUserId} = await request.json()
    try {
        if(followingUserId === id){
            return NextResponse.json({message:"you can not follow yourself"},{status: 404})
        }

        if(!followingUserId){
            return NextResponse.json({message:"all field is required"},{status: 404})
        }

        const userExisit = await User.findById(followingUserId)
        if(!userExisit){
            return NextResponse.json({message:"user not fould"},{status: 404})
        }
            //unfollow user
        if(userExisit.followers.includes(id)){
            const updatedUser=await User.findByIdAndUpdate(id,{$pull:{following:followingUserId}},{new:true})
            await User.findByIdAndUpdate(followingUserId,{$pull:{followers:id}},{new:true})
            return NextResponse.json({message:"Successfully unfollowed user",user:updatedUser},{status: 200})
        }else{
            //follow user
            const updatedUser=await User.findByIdAndUpdate(id,{$addToSet:{following:followingUserId}},{new:true})
            await User.findByIdAndUpdate(followingUserId,{$addToSet:{followers:id}},{new:true})
            return NextResponse.json({message:"Successfully followed user",user:updatedUser},{status: 200})
        }
    } catch (error) {
        return NextResponse.json({message:`Error following user ${error}`},{status: 500})
    }
}