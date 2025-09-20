import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Provider from "../models/provider.model.js";
import Service from "../models/services.models.js";

const addAService = asyncHandler(async(req, res) => {

    const provider = await Provider.findOne({
        user: req.user._id
    })

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

    const service = await Service.create({
        providerId: provider,
        categoryId,
        name,
        description,
        price,
        location,
    });

    const serviceWithDetails = await Service.findById(service._id)
    .populate({
        path: "providerId",
        select: "description address user",
        populate: {
            path: "user", 
            select: "fullname" 
        }
    })
    .populate("categoryId", "name");
    
    return res.status(200).json(
        new ApiResponse(
            201,
            serviceWithDetails,
            "Service added successfully!"
        )
    )
});

const getService = asyncHandler(async (req, res) => {
    const { id } = req.params

    const service = await Service.findById(id)
    .populate("name description price location")

    return res.status(200).json(
        new ApiResponse(
            200,
            service,
            "Service fetched successfully!"
        )
    )
});

const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        price,
        location,
        categoryId
    } = req.body;

    const service = await Service.findByIdAndUpdate(id,
        {
            $set: {
                ...(name && { name }),
                ...(description && { description }),
                ...(price && { price }),
                ...(location && { location }),
                ...(categoryId && { categoryId })
            }
        },
        {
            new: true
        }
    )
    .populate({
        path: "providerId",
        select: "description address user",
        populate: {
            path: "user",
            select: "fullname"
        }
    })
    .populate("categoryId", "name")

    if (!service) {
        throw new ApiError(404, "Service not found!");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            service,
            "Service updated successfully!"
        )
    );
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "Service deleted Successfully!"
        )
    );
});

export { addAService, getService, updateService, deleteService };