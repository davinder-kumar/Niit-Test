const mongoose = require("mongoose")
var VideoSchema = mongoose.Schema(
    {
        videopath: {
            type: String,
            required: true,
            trim: true
        },
        smallThumb: {
                type: String,
                required: true,
                trim: true
        },
        largeThumb: {
                type: String,
                required: true,
                trim: true
        },

        
    });

var Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
