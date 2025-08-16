import mongoose from "mongoose";

function connectDB() {
    mongoose.connect(`${process.env.MONGO_URI}`, {
            writeConcern: { w: "majority" },
        })
    .then(() => {
        console.log("Connected To DB");
    })
    .catch((error) => {
        console.log("DB connection Error: ", error);
    })
}

export default connectDB;