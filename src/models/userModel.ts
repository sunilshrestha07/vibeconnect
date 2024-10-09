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
    },
    verificationExpires: {
        type: Date,
    },
    avatar: {
        type: String,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    bio:{
        type: String,
    }
},{timestamps: true})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User