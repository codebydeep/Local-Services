import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const checkProvider = asyncHandler(async(req, res, next) => {
    if(req.user.role !== "provider"){
        throw new ApiError(
            400,
            "Not authorized for this service!"
        );
    }

    next();
});

export default checkProvider;