import mongoose from "mongoose";

export const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("mongodb is connected");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection err, please make sure db is up and running: " + err
      );

      process.exit();
    });
  } catch (error) {
    console.log("something went wrong in connecting to db");
    console.log(error);
  }
};
