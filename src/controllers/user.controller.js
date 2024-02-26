import { asyncHandler } from "../utils/asyncHandler.js";

// Method for register
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    });
});

export { 
    registerUser,
 } // Export the registerUser function
