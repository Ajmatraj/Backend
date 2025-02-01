import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

dotenv.config({ path: './env' });

connectDB()
    .then(() => {
        // Ensuring app is an instance of Express
        if (app && typeof app.listen === 'function') {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
            });
        } else {
            console.log("Error: `app.listen` is not a function, check the app initialization.");
        }
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err);
    });
