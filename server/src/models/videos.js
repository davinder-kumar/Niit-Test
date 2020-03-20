const mongoose = require("mongoose")
var VideoSchema = mongoose.Schema(
    {
        videopath: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        chunks: [],
        thumbs: [{}],
    });

var Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
