import dbConnect from "@/lib/db";
import Post from "@/models/postModel";
import Reel from "@/models/reelModel";
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

        const reel = new Reel({
            user,
            discription,
            media:{
                url: media.url,
                type: media.type,
            }
        })

        await reel.save()
        return NextResponse.json({message:"Successfully created reel",reel:reel},{status: 200})
    } catch (error) {
       return NextResponse.json({message:`Error creating reel ${error}`},{status: 500}) 
    }
}


//getting all the post
export async function GET(request: Request) {
    await dbConnect();
    try {
        const allreel = await Reel.find()
            .sort({ createdAt: -1 })
            .populate("user", "userName avatar");

        // Manually filter out post where the user is null
        const filteredReel = allreel.filter((Reel: any) => Reel.user !== null);

        if (filteredReel.length === 0) {
            return NextResponse.json({ message: "No Post found" }, { status: 404 });
        }

        return NextResponse.json({ message: "All the stories are:", allReel: filteredReel }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error fetching all stories: ${error.message}` }, { status: 500 });
    }
}