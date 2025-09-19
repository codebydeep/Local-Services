import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if(!name || !description){
        throw new ApiError(
            400,
            "All fields are required!"
        );
    }

    const existingCategory = await Category.findOne({ name });

    if(existingCategory){
        throw new ApiError(
            400,
            "Category already exists!"
        );
    } 

    const category = await Category.create({
        name,
        description
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category added successfully!"
        )
    );
});

const removeCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category removed successfully!"
        )
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    return res.status(200).json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully!"
        )
    );
});
export { addCategory, removeCategory, getAllCategories };