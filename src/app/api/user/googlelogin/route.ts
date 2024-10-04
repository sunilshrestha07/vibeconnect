import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/userModel';
import { sendMail } from '@/utils/SendMail';

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

    // Check if the user exists and is verified
    if (user && user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'User already exists and is verified' },
        { status: 400 }
      );
    }

    // If the user exists but is not verified, proceed to update verification details
    if (user && !user.isVerified) {
      user.userName = userName;
      user.password = await bcrypt.hash(userName, 10);
      user.verificationCode = generateVerificationCode();
      user.verificationExpires = Date.now() + 180000; // 3 minutes

      await user.save();
      await sendMail({
        email,
        userName,
        verificationCode: user.verificationCode,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'User updated with new verification code',
          user,
        },
        { status: 200 }
      );
    }

    // If the user does not exist, create a new user
    const newUser = new User({
      userName,
      email,
      password: await bcrypt.hash(userName, 10),
      verificationCode: generateVerificationCode(),
      verificationExpires: Date.now() + 180000, // 3 minutes
    });

    await newUser.save();
    await sendMail({
      email,
      userName,
      verificationCode: newUser.verificationCode,
    });

    return NextResponse.json(
      { success: true, message: 'User created successfully', user: newUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error creating user', error },
      { status: 500 }
    );
  }
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
