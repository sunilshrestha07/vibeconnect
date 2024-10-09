import dbConnect from "@/lib/db";
import Story from "@/models/storyModel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request,{params}:any) {
    await dbConnect()
    const _id = params.id
    try {
        const postexists = await Story.findById(_id)
        if(!postexists){
            return NextResponse.json({message:"user not fould"},{status: 404})
        }
        await Story.findByIdAndDelete(_id)
        return NextResponse.json({message:"Successfully deleted post"},{status: 200})
    } catch (error: any) {
        return NextResponse.json({message:`Error deleting post ${error}`},{status: 500})
    }
}