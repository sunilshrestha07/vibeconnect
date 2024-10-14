import dbConnect from "@/lib/db";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request,{params}:any) {
    await dbConnect()
    const _id = params.id
    try {
        const postexists = await Post.findById(_id)
        if(!postexists){
            return NextResponse.json({message:"Post not fould"},{status: 404})
        }
        await Post.findByIdAndDelete(_id)
        return NextResponse.json({message:"Successfully delted the  post"},{status: 200})
    } catch (error: any) {
        return NextResponse.json({message:`Error deleting post ${error}`},{status: 500})
    }
}


//updating the post for removing like and adding likes
export async function PUT(request: Request,{params}:any) {
    const {userId} = await request.json()
    const id = params.id
    await dbConnect()
    try {
        const postexists = await Post.findById(id)
        if(!postexists){
            return NextResponse.json({message:"Post not fould"},{status: 404})
        }

        //if post exists
        if (postexists.likes.includes(userId)) {
            // Unlike the post
            await Post.findByIdAndUpdate(
                { _id: id },
                { $pull: { likes: userId } }
                  
            );
            return NextResponse.json({ message: "Post unliked successfully" }, { status: 200 });
        } else {
            // Like the post
            await Post.findByIdAndUpdate(
                { _id: id },
                { $addToSet: { likes: userId } }
            );
            return NextResponse.json({ message: "Post liked successfully" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({message:`Error deleting post ${error}`},{status: 500})
    }
}