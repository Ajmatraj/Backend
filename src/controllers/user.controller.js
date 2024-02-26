import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// Method for register
const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty?
    //check if user already exists.
    //check for images, check for avatar
    //upload them to cloudneary.
    //create user object - create entry in DB.
    //remove password and refresh token field form response
    //chesk for user creation
    //return response


        //get user details from frontend
    const {fullName,email,Username,password} = req.body
    // console.log("email: ", email);

    //validation - not empty?
    if (
        [fullName,email,Username,password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are requored")
    }

    //check if user already exists.
    const existedUser = await User.findOne({
        $or: [ {Username}, {email} ]
    })

    //check if user already exists.
    if (existedUser){
        throw new ApiError(409, "user with email or username already exist!!!")
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImagePath = req.files?.coverImage[0]?.path;

    let coverImageLocationPath;
    if (req.files && Array(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocationPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }
    
    //upload them to cloudneary.
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    
   

    if (!avatar){
        throw new ApiError(400, "Avatar is required !!")
    }

    //create user object - create entry in DB.
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        Username: Username.toLowerCase()
    })

    //remove password and refresh token field form response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

     //chesk for user creation
    if (!createdUser){
        throw new ApiError(500, "something is wrong, User is not register")
    }

    //return response
    return res.this.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfuly")
    )


});

export { 
    registerUser,
 } // Export the registerUser function
