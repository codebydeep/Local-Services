import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.model.js";
import Provider from "../models/provider.model.js";

const addServiceProvider = asyncHandler(async(req, res) => {
    const userId = req.params.id;

    const {
        businessName,
        description,
        address
    } = req.body

    if(!businessName || !description || !address){
        throw new ApiError(
            400,
            "All the fields are required!"
        );
    }

    req.user.role = "provider";

    const provider = await Provider.create({
        user: req.user.fullname,
        businessName,
        description,
        address
    })

    const providerWithUser = await Provider.findById(provider._id)
    .populate("user", "fullname email");

    return res.status(201).json(
        new ApiResponse(
            201,
            providerWithUser,
            "Service provider added successfully!"
        )
    )
})

const getProviderProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-_id -password -isEmailVerified -emailVerificationToken -refreshToken")
    console.log(user);

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Profile fetched successfully!"
        )
    )
});

const createProviderProfile = asyncHandler(async(req, res) => {
    const userId = req.user._id

    const existingProfile = await Provider.findOne({ user: userId })

    if(existingProfile){
        throw new ApiError(
            400,
            "Profile already exists!"
        )
    }

    const {
        description,
        address
    } = req.body

    if(!description || !address){
        throw new ApiError(
            400,
            "All the fields are required!"
        );
    }

    const provider = await Provider.create({
        user: userId,
        description,
        address
    })

    return res.status(200).json(
        new ApiResponse(
            201,
            provider,
            "Profile created successfully!"
        )
    )
});

export { addServiceProvider, getProviderProfile, createProviderProfile };