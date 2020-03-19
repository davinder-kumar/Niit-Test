const express = require("express")
const router = express.Router();
const videoModel = require("../models/videos")

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post("/video", (req, res) => {
  const data = {}
  data['videopath'] = "test"
  data['smallThumb'] = "test1"
  data['largeThumb'] = "test1"

  const obj = new videoModel(data)
  obj.save((err, video) => {
    if (err) {
      console.log(err)
    } else {
      console.log(video)
    }
  })
  res.send()
})

module.exports = router