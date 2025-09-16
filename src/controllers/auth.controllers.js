import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

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
            createdUser,
            "User registered successfully"
        )
    )
}); 

const login = asyncHandler(async (req, res) => {
    const { 
        email,
        password
    } = req.body

    if(!email || !password){
        throw new ApiError(400, "All the credentials are required!")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, "User not found!")
    }

    const isMatched = await user.isPasswordMatched(password);

    if(!isMatched){
        throw new ApiError(400, "Invalid credentials!")
    }

    const loginUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry")

    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken

    user.save({validateBeforeSave: false})

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

    res.status(200).json(
        new ApiResponse(
            200,
            loginUser,
            "User loggedin successfully!"
        )
    )
}); 

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    );

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict"
    })

    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict"
    })

    res.status(200).json(
        new ApiResponse(
            200,
            "User logged out successfully!"
        )
    )
}); 

export { register, login, logout };