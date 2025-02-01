import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Import registerUser function
import { loginUser } from "../controllers/login.controller.js"; // Import loginUser function
import { assigningRole } from "../controllers/role.controller.js"; // Import the assigningRole controller
import { getUserDetails, getAllUsers } from "../controllers/user.controller.js"; // Import getUserDetails function

const router = Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Post route for assigning roles
router.post("/assign-role/:id", assigningRole);

// Get user details route
router.get("/user-details/:id", getUserDetails);

// Get all users route
router.get("/all-users", getAllUsers);

export default router;
