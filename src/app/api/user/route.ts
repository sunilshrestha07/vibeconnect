import dbConnect from "@/lib/db";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const allusers = await User.find()
        return NextResponse.json({message:"all users are",user:allusers},{status: 200})
    } catch (error :any) {
        return NextResponse.json({message:`Error fetching users ${error.message}`},{status: 404})
    }
}