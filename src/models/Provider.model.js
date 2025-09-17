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
            required: true
        },
        description: {
            type: String,
            maxLength: 100,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Provider = mongoose.model("Provider", providerSchema);

export default Provider;