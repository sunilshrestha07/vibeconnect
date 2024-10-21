import dbConnect from "@/lib/db";
import Reel from "@/models/reelModel";
import { NextResponse } from "next/server";

export async function DELETE(request: Request,{params}:any) {
    await dbConnect()
    const _id = params.id
    try {
        const Reelexists = await Reel.findById(_id)
        if(!Reelexists){
            return NextResponse.json({message:"Reel not fould"},{status: 404})
        }
        await Reel.findByIdAndDelete(_id)
        return NextResponse.json({message:"Successfully delted the  Reel"},{status: 200})
    } catch (error: any) {
        return NextResponse.json({message:`Error deleting Reel ${error}`},{status: 500})
    }
}


//updating the Reel for removing like and adding likes
export async function PUT(request: Request,{params}:any) {
    const {userId} = await request.json()
    const id = params.id
    await dbConnect()
    try {
        const Reelexists = await Reel.findById(id)
        if(!Reelexists){
            return NextResponse.json({message:"Reel not fould"},{status: 404})
        }

        //if Reel exists
        if (Reelexists.likes.includes(userId)) {
            // Unlike the Reel
            await Reel.findByIdAndUpdate(
                { _id: id },
                { $pull: { likes: userId } }
                  
            );
            return NextResponse.json({ message: "Reel unliked successfully" }, { status: 200 });
        } else {
            // Like the Reel
            await Reel.findByIdAndUpdate(
                { _id: id },
                { $addToSet: { likes: userId } }
            );
            return NextResponse.json({ message: "Reel liked successfully" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({message:`Error deleting Reel ${error}`},{status: 500})
    }
}