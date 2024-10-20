import dbConnect from '@/lib/db';
import Comment from '@/models/commentModel';
import Post from '@/models/postModel';
import { NextResponse } from 'next/server';

//getting all the comments
export async function GET(request: Request) {
  await dbConnect();
  try {
    const allcomments = await Comment.find().sort({createdAt: -1}).populate("user", "userName avatar");

    // Manually filter out cpmments where the user is null
    const filteredComment = allcomments.filter((comment: any) => comment.user !== null);

    if (filteredComment.length === 0) {
        return NextResponse.json({ message: "No comment found" }, { status: 404 });
    }
    return NextResponse.json({ message: "All the comments are:", allcomments: filteredComment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: `Error fetching all comments: ${error.message}` }, { status: 500 });
  }
}


//post comment
export async function POST(request: Request) {
    await dbConnect();
    try {
        const {comment,user,post} = await request.json();

        const newcomment = new Comment({
            comment,
            user,
            post
        })
        await newcomment.save();
        // Update the post with the new comment ID
        const updatedPost = await Post.findByIdAndUpdate(
          { _id: post },
          { $addToSet: { comments: newcomment._id } },
          { new: true } // return the updated document
      );

        return NextResponse.json({message:"Successfully created comment",comment:updatedPost},{status: 200})
    } catch (error: any) {
        return NextResponse.json({message:`Error creating comment ${error.message}`},{status: 500})
    }
    
}