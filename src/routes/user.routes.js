import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Import registerUser function
import { loginUser } from "../controllers/login.controller.js"; // Import loginUser function
import { assigningRole } from "../controllers/role.controller.js"; // Import the assigningRole controller
import { updateUserDetails,getUserDetailsById, getAllUsersfilters ,getAllUsers} from "../controllers/user.controller.js"; // Import getUserDetails function

const router = Router();

// Route for user registration
router.post("/register", registerUser);

// Add this route to handle updating user details
router.put("/update/:id", updateUserDetails);

// Route for user login
router.post("/login", loginUser);

// Post route for assigning roles
router.post("/assign-role/:id", assigningRole);

// Get user details route
router.get("/userbyid/:id", getUserDetailsById);

// Get all users route
router.get("/filterUsers", getAllUsersfilters);

router.get("/allUsers", getAllUsers);

export default router;
