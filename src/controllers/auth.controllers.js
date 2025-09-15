import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";

const register = asyncHandler(async (req, res) => {
    const {
        fullname,
        email,
        password
    } = req.body

    if(!fullname || !email || !password){
        throw new ApiError(400, "All the fields are required!")
    }

    const existingUser = await User.findOne({ email });

    if(existingUser){
        throw new ApiError(400, "User already exists!")
    }

    const user = await User.create({
        fullname,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
    const emailToken = user.generateEmailVerificationToken()

    user.refreshToken = refreshToken
    user.accessToken = accessToken
    user.emailVerificationToken = emailToken
    user.emailVerificationTokenExpiry = Date.now() + 10 * 60 * 1000

    user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.cookie("accessToken", accessToken, {
         httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            createdUser
        )
    )
}); 

const login = asyncHandler(async (req, res) => {

}); 

const logout = asyncHandler(async (req, res) => {

}); 

export { register, login, logout };