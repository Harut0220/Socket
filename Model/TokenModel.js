import { Schema, model } from "mongoose";

const TokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = model("RefreshToken", TokenSchema);

export default RefreshToken;