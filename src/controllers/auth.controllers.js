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

    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()
    const emailToken = await user.generateEmailVerificationToken()

    user.refreshToken = refreshToken
    user.emailVerificationToken = emailToken
    user.emailVerificationTokenExpiry = Date.now() + 10 * 60 * 1000

    await user.save({ validateBeforeSave: false })

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

    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()

    user.refreshToken = refreshToken

    await user.save({validateBeforeSave: false});

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

    return res.status(200).json(
        new ApiResponse(
            200,
            "User logged out successfully!"
        )
    )
});

const getProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry")
    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User Profile fetched successfully!"
        )
    )
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {
        oldPassword,
        newPassword
    } = req.body

    if(oldPassword == newPassword){
        throw new ApiError(
            400,
            "Passwords must be different!"
        )
    }

    const user = await User.findById(req.user._id)

    const isMatched = await user.isPasswordMatched(oldPassword);

    if(!isMatched){
        throw new ApiError(
            400,
            "Invalid old Password!"
        )
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "Password changed successfully!"
        )
    )
});

const verifyEmail = asyncHandler(async(req, res) => {
    const token = req.query.token;
    
    if(!token){
        throw new ApiError(
            400,
            "Token is required to verify Email!"
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);

        if(!decoded){
            throw new ApiError(
                400,
                "Invalid Email token!"
            )
        }

        const user = await User.findOne({
            _id: decoded.id,
            emailVerificationToken: token,
            emailVerificationTokenExpiry: { $gt: Date.now() }
        })

        if(!user){
            throw new ApiError(
                400,
                "User not found!"
            )
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "Email verified successfully!"
            )
        )

    } catch (error) {
        throw new ApiError(
            400,
            "Error while verifying Email token!"
        )
    }
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(
            400,
            "Unauthorized request"
        );
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(
                401,
                "Refresh Token is expired or used!"
            );
        }

        const newRefreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken()

        user.refreshToken = newRefreshToken;

        await user.save({ validateBeforeSave: false });

         res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                accessToken: accessToken, 
                refreshToken: newRefreshToken
            },
            "Access token refreshed successfully!",
        )
    )
    } catch (error) {
        throw new ApiError(
            401,
            "Invalid refresh token"
        )
    }
})

export { 
    register, 
    login, 
    logout, 
    getProfile, 
    changeCurrentPassword, 
    verifyEmail, 
    refreshAccessToken 
};