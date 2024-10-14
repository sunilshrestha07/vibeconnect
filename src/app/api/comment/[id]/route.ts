import dbConnect from "@/lib/db";
import Comment from "@/models/commentModel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request,{params}:any) {
    const id = await params.id
    await dbConnect()
    try {
        const commentExists = await Comment.findById(id)

        if(!commentExists){
            return NextResponse.json({message:"comment not fould"},{status: 404})
        }

        await Comment.findByIdAndDelete(id)
        return NextResponse.json({message:"Successfully deleted comment"},{status: 200})
    } catch (error:any) {
        return NextResponse.json({message:`Error deleting comment ${error}`},{status: 500})
    }
    
}