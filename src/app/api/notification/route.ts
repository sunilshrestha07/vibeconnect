import dbConnect from '@/lib/db';
import Notification from '@/models/notificationMode';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();
  const { notificationFor, notificationFrom, notificationType, post } =
    await request.json();
  try {
    if (!notificationFor || !notificationFrom || !notificationType) {
      return NextResponse.json(
        { message: 'all filds are required' },
        { status: 404 }
      );
    }

    if (
      notificationType !== 'comment' &&
      notificationType !== 'like' &&
      notificationType !== 'follow'
    ) {
      return NextResponse.json(
        { message: 'all filds are required' },
        { status: 404 }
      );
    }

    const notification = new Notification({
      notificationFor,
      notificationFrom,
      notificationType,
      post,
    });

    await notification.save();

    return NextResponse.json(
      {
        message: 'Successfully created notification',
        notification: notification,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error creating notification ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const allnotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('notificationFor notificationFrom', 'userName avatar')
      .populate('post', 'media');

    return NextResponse.json(
      { message: 'all notifications are', notification: allnotifications },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error fetching notifications: ${error.message}` },
      { status: 500 }
    );
  }
}

// delete the notification
export async function DELETE(request: Request) {
  await dbConnect();
  
  try {
    // Destructure request body to get the required fields
    const { notificationFor, notificationFrom, notificationType, post } = await request.json();

    // Find the notification and delete it if it exists
    const deletedNotification = await Notification.findOneAndDelete({
      notificationFor: notificationFor, // Ensure the correct field matching
      notificationFrom: notificationFrom,
      notificationType: notificationType,
      post: post ? post : null, // Handle the case where post might be null or undefined
    });

    if (deletedNotification) {
      return NextResponse.json(
        { message: 'Notification deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No matching notification found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error deleting notification: ${error.message}` },
      { status: 500 }
    );
  }
}
