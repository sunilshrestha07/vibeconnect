import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationExpires: {
        type: Date,
        required: true
    },
    avatar: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeONWylK6HlbseMI4SJmyUvVff9KNxARyjww&s"
    }
},{timestamps: true})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User