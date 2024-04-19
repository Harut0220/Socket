import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

const Users = model("Users", UserSchema);

export default Users;