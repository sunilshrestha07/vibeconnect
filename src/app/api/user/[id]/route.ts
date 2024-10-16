import dbConnect from '@/lib/db';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { hash } from 'crypto';

export async function GET(request: Request, { params }: any) {
  await dbConnect();
  const id = params.id;
  try {
    const user = await User.findById(id).populate(
      'followers following',
      'userName avatar'
    );

    if (!user) {
      return NextResponse.json({ message: 'user not fould' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'user fould', user: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(`Error fetching data: ${error.message}`, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const _id = params.id;
  await dbConnect();

  try {
    const validUser = await User.findById(_id);
    if (!validUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { userName, email, password, avatar, bio } = await request.json();

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            userName,
            email,
            avatar,
            password: hashedPassword,
            bio: bio,
          },
        },
        { new: true } // This option returns the updated document
      ).populate('followers following', 'userName avatar');;

      return NextResponse.json({ message: 'user updated', user: updatedUser }, { status: 200 });
    }

    //if no passowrd
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          userName,
          email,
          avatar,
          bio,
        },
      },
      { new: true } // This option returns the updated document
    ).populate('followers following', 'userName avatar');

    return NextResponse.json({ message: 'user updated', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating user' },
      { status: 500 }
    );
  }
}
