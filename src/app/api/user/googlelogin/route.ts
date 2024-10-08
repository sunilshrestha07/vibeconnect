import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/userModel';
import { sendMail } from '@/utils/SendMail';
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, avatar } = await request.json();

    if (!userName || !email) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      //send all info of the user except the password
      const { password: pass, ...rest } = user.toObject();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '20d' }
      );
      const response = NextResponse.json({
        message: 'user logined in successfully',
        success: true,
        user: rest,
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 200 * 60 * 60,
      });

      return response;
    }

    // If the user does not exist, create a new user
    const newUser = new User({
      userName,
      email,
      avatar,
      password: await bcrypt.hash("password", 10),
      isVerified: true
    });

    await newUser.save();
     //send all info of the user except the password
     const { password: pass, ...rest } = newUser.toObject();

     const token = jwt.sign(
       { userId: newUser._id },
       process.env.JWT_SECRET!,
       { expiresIn: '20d' }
     );
     const response = NextResponse.json({
       message: 'user logined in successfully',
       success: true,
       user: rest,
     });
 
     response.cookies.set('token', token, {
       httpOnly: true,
       maxAge: 200 * 60 * 60,
     });
 
     return response;
  } catch (error :any) {
    return NextResponse.json(
      { success: false, message: `Error creating user ${error.message}`, error },
      { status: 500 }
    );
  }
}

