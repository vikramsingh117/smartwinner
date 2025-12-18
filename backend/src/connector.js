import mongoose from "mongoose"

mongoose.connect('mongodb://127.0.0.1:27017/test_db');

export const db = mongoose.connection;
db.on("open", () => console.log("Mongo connected"));
db.on("error", console.error);