import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Provider from "../models/provider.model.js";
import Service from "../models/services.models.js";

const addAService = asyncHandler(async(req, res) => {
    if (!req.provider || !req.provider._id) {
    throw new ApiError(401, "Unauthorized: Provider not found in request!");
  }

    const provider = await Provider.findById(req.provider._id)

    if(!provider){
        throw new ApiError(
            400,
            "Provider not found!"
        )
    }

    const {
        categoryId,
        name,
        description,
        price,
        location,
    } = req.body;
    
    if(!name || !description || !price || !location){
        throw new ApiError(
            400,
            "All the fields are required!"
        )
    }

    const service = await provider.Service.create({
        providerId: provider,
        categoryId,
        name,
        description,
        price,
        location,
    });

    const serviceWithDetails = await Service.findById(service._id)
    .populate("providerId", "name")
    .populate("categoryId", "name");

    return res.status(200).json(
        new ApiResponse(
            200,
            serviceWithDetails,
            "Service added successfully!"
        )
    )
});

export { addAService };