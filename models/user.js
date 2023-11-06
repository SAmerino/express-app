import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rut: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default mongoose.model("User", userSchema);