import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content:{
        type: String,
    },
    image:{
        type: String,
        required: true
    },
    likes:[{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},{timestamps: true})

const Post = mongoose.models.Post || mongoose.model("Post",postSchema)
export default Post