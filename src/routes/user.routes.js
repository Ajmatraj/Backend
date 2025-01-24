import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Import registerUser function

const router = Router();

// Route for user registration (no multer, just direct upload)
router.post("/register", registerUser);

// Test route
router.route("/test").get((req, res) => {
    res.send("Test route response"); // Respond with a simple message
});

export default router;
