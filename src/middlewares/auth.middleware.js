import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken"

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token = req.cookies?.accessToken;

    if(!token){
        throw new ApiError(
            401, 
            "Unauthorized request"
        )
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!decode){
        throw new ApiError(
            401,
            "Unauthorized request"
        )
    }

    const user = await User.findById(decode.id);

    if(!user){
        throw new ApiError(
            401,
            "Account not found!"
        )
    }

    req.user = user;
    next();
});

export { authMiddleware };