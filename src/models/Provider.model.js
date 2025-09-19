import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        servicesOffered: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Services",
            // required: true
        },
        businessName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            maxLength: 100,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: Number,
        }
    },
    {
        timestamps: true,
    }
);

const Provider = mongoose.model("Provider", providerSchema);

export default Provider;