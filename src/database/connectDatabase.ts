import { connect } from "mongoose";

export const connectDatabase = async () => {
    await connect(`${process.env.MONGO_URI}`, {dbName: 'Tracker'});
    console.log("Connected to database!")
}