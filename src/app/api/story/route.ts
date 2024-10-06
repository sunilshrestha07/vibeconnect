import dbConnect from "@/lib/db";
import Story from "@/models/storyModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {user,media} = await request.json()

        //if media and user is not found
        if(!user || !media.url ||!media.type ){
            return NextResponse.json({message:"all filds are required"},{status: 404})
        }

        //check if the user exist or not 
        const userExist = await User.findById(user)
        if(!userExist){
            return NextResponse.json({message:"user not fould"},{status: 404})
        }

        //create new story
        const story = new Story({
            user: user,
            media: {
              url: media.url,
              type: media.type,
            },
          });

        await story.save()

        return NextResponse.json({message:"Successfully created story",story:story},{status: 200})
    } catch (error:any) {
        return NextResponse.json({message:`Error creating story ${error.message}`},{status: 500})
    }
}


//getting all the story
export async function GET(request: Request) {
    await dbConnect()
    try {
        const allstory = await Story.find()
        .sort({createdAt:-1})
        .populate("user",'userName avatar')

        if(allstory.length === 0){
            return NextResponse.json({message:"No story found"},{status: 404})
        }
        return NextResponse.json({message:"All the story are:",allstory:allstory},{status: 200})
    } catch (error :any) {
        return NextResponse.json({message:`Error ting all story ${error.message}`},{status: 500})
    }
    
}