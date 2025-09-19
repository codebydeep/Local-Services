import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    description: {
      type: String,
    },
    price: { 
        type: Number, 
        required: true 
    },
    location: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    rating: { 
        type: Number, 
        default: 0
    },
  },
  { 
    timestamps: true
  },
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;