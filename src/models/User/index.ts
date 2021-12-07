import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  username: string;
  token: string;
}

const schema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const User = mongoose.model<UserDocument>("User", schema);

export default User;
