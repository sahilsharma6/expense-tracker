import mongoose from "mongoose";
import config from "./config.js";

const connectDB = () => {
  mongoose.connect(config.MONGO_URI, {}).then(() => {
    console.log("Database Connected");
  });
};
export default connectDB;
