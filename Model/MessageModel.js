import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
    {
        roomId: { type: String},
        user:{type: String},
        message:{type:String},
        date: { type: String},
        time:{type:String},
    },
    {
        timestamps: true,
    }
)

const MessageModel = model("MessageModel", MessageSchema)

export default MessageModel