import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Import registerUser function

import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            naem:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

// Test route
router.route("/test").get((req, res) => {
    res.send("Test route response"); // Respond with a simple message
});
export default router
