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

export default router
