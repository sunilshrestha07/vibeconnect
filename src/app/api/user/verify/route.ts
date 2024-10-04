import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { email, verificationCode } = await request.json();
  
        if (!email || !verificationCode) {
          return NextResponse.json({message:"all filds are required"},{status: 404})
        }
  
        const user = await User.findOne({ email });
  
        if (!user) {
          return NextResponse.json({message:"user not fould"},{status: 404})
        }
  
        if (user.isVerified) {
          return NextResponse.json({message:"user is already veriied"},{status: 404})
        }
  
        if (user.verificationCode !== verificationCode) {
          return NextResponse.json({message:"code doesnot match"},{status: 404})
        }
  
        if (user.verificationExpires < new Date()) {
          return NextResponse.json({message:"time expired"},{status: 404})
        }
  
        const verifiedUser = await User.findByIdAndUpdate(user._id, {
          isVerified: true,
          verificationCode: null,
          verificationExpires: null,
        })
        

        const { password: pass, ...rest } = verifiedUser.toObject();

        const token = jwt.sign({ userId: verifiedUser._id}, process.env.JWT_SECRET!, { expiresIn: "20d" });
        const response = NextResponse.json({
            message: "verified successfully",
            success: true,
            user: rest
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 200 * 60 * 60,
        });

        return response;
      } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({message:"Error verifing uer"},{status: 404})
      }
}