import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const MessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId, /****** Tell the mongoDB that this field is a reference to the User model ******/
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User", /****** Tell the mongoDB that this field is a reference to the User model ******/
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
export default Message;