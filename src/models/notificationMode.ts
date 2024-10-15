import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    notificationFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Post",
    },
    notificationType: {
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true
    },
    notificationFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    }
},{timestamps:true})

const  Notification = mongoose.models.Notification || mongoose.model("Notification",notificationSchema)
export default Notification