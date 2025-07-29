import { error } from "console";
import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongodb connected succesfully");
    });
    connection.on("error", () => {
      console.log("Mongodb connection error" + error);
      process.exit();
    });
  } catch (error) {
    console.log("Something goes wrong");
    console.log(error);
  }
}
