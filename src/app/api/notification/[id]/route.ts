import dbConnect from "@/lib/db"
import Notification from "@/models/notificationMode"
import { NextResponse } from "next/server"

export async function DELETE(request: Request,{params}:any) {
    const id = params.id
    await dbConnect()
    try {
        const notificationExists = await Notification.findByIdAndDelete(id)
        if(!notificationExists){
            return NextResponse.json({message:"notification not fould"},{status: 404})
        }
        await Notification.findByIdAndDelete(id)
        return NextResponse.json({message:"Successfully deleted notification"},{status: 200})
    } catch (error:any) {
        return NextResponse.json({message:`Error deleting notification ${error}`},{status: 500})
    }
}