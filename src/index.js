import app from "./app.js";
import connectDB from "./db/dbConnect.js"

import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server💻 started on port: ${port}`);
    })
})
.catch((err) => {
    console.error(`MongoDB Connection error`, err)
    process.exit(1);
})