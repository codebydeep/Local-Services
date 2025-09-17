import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.CUSTOMER
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationTokenExpiry: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password); 
}

userSchema.methods.generateEmailVerificationToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
        {
            expiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }       
    );
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }       
    );
}

const User = mongoose.model("User", userSchema);

export default User;