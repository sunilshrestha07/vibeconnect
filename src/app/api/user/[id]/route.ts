import dbConnect from '@/lib/db';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
  await dbConnect();
  const id = params.id;
  try {
    const user = await User.findById(id).populate('followers following',"userName avatar");;

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
