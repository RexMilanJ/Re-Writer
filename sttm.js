const mongoose = require("mongoose");

mongoose.model("UserInfo",UserDetailsSchema);

const TextToSpeech = new mongoose.Schema(
    {
        text: String,
    },
    {
        collation: "TextData",
    }
)