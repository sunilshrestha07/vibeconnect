import dbConnect from '@/lib/db';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';
import bcrpyt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await dbConnect();
  try {
    //getting the email and password
    const { email, password } = await request.json();

    //checking if email and password are not empty
    if (!email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 404 }
      );
    }

    //finding the user
    const verifiedUser = await User.findOne({ email: email });

    //checking if user's password is verified or not
    const verifiedPassword = bcrpyt.compareSync(
      password,
      verifiedUser.password
    );

    //if password dont match
    if (!verifiedPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 404 }
      );
    }

    //send all info of the user except the password
    const { password: pass, ...rest } = verifiedUser.toObject();

    const token = jwt.sign(
      { userId: verifiedUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: '20d' }
    );
    const response = NextResponse.json({
      message: 'user logined in successfully',
      success: true,
      user: rest,
      token: token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 200 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}
