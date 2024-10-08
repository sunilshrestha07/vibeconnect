import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const token = jwt.sign({ userId: "" }, process.env.JWT_SECRET!, { expiresIn: 0 });

        const response = NextResponse.json({
            message: "Logged out successfully",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0), 
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error logging out" },
            { status: 500 }
        );
    }
}