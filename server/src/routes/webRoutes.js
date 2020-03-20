const express = require("express")
const router = express.Router();
const videoModel = require("../models/videos")

router.get("/videos", (req, res) => {

  videoModel.find({}, function (err, videos) {
    if (err) {
      res.json({ status: 0 }).status(400);
    }
    var videoMap = [];
    videos.forEach(function (video) {
      videoMap.push({
        video: video.videopath,
        thumbs: video.thumbs,
        name: video.name
      })
    });
    res.json(videoMap).status(200);
  })
});

module.exports = router