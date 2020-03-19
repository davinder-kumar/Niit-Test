const path = require('path')
const uuidv4 = require('uuid/v4');
const fs = require("fs")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg")
ffmpeg.setFfmpegPath(ffmpegPath);
const pump = require("pump")
const videoModel = require("../models/videos")
var Files = {}

const socketHandler = socket => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("Start", (data) => {
        var Name = data['Name'];
        Files[Name] = {  //Create a new Entry in The Files Variable
            FileSize: data['Size'],
            Data: "",
            Downloaded: 0
        }
        var Place = 0;
        try {
            var Stat = fs.statSync('src/Temp/' + Name);
            if (Stat.isFile()) {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            }
        }
        catch (er) { } //It's a New File
        fs.open("src/Temp/" + Name, "a", 0755, function (err, fd) {
            if (err) {
                console.log(err);
            }
            else {
                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                socket.emit('MoreData', { 'Place': Place, Percent: 0 });
            }
        });
    })

    socket.on('Upload', function (data) {
        var Name = data['Name'];
        console.log(Name, "TEST")
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        {
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                const filename = uuidv4();
                const ext = path.extname(Name)
                var inp = fs.createReadStream("src/Temp/" + Name);
                var out = fs.createWriteStream("src/uploads/Video/" + filename + ext);
                pump(inp, out, function () {
                    fs.unlink("src/Temp/" + Name, function () { //This Deletes The Temporary File
                        ///small screenshot
                        var proc = new ffmpeg("src/uploads/Video/" + filename + ext)
                            .on('filenames', function (filenames) {
                                console.log('screenshots are ' + filenames.join(', '));
                            })
                            .takeScreenshots({
                                count: 1,
                                timemarks: ['00:00:02.000'], // number of seconds,
                                size: '200x200',
                                filename: filename + '-small.png'

                            }, 'src/uploads/Video/thumbs', function (err) {
                                console.log('screenshots were saved')

                            })

                        ///second screenshot
                        proc = new ffmpeg("src/uploads/Video/" + filename + ext)
                            .on('end', async function () {

                                const VideoData= {
                                    'videopath' : filename + ext,
                                    'smallThumb' : filename + '-small.png',
                                    'largeThumb' : filename + '-large.png',
                                }
                                const video = await new videoModel(VideoData)
                                await video.save((err)=>{
                                    if(err){
                                        throw new Error("Some error occured")
                                    }
                                })

                                console.log('screenshots were saved');
                                socket.emit('Done', { 'Image': 'src/uploads/Video/' + Name + '.jpg' });
                            })
                            .on('filenames', function (filenames) {
                                console.log('screenshots are ' + filenames.join(', '));
                            })
                            .takeScreenshots({
                                count: 1,
                                timemarks: ['00:00:02.000'], // number of seconds,
                                size: '400x400',
                                filename: filename + '-large.png'

                            }, 'src/uploads/Video/thumbs', function (err) {
                                console.log('screenshots were saved')

                            })
                    });
                });
            });
        }
        else if (Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', { 'Place': Place, 'Percent': Percent });
            });
        }
        else {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place': Place, 'Percent': Percent });
        }
    });

}
module.exports = socketHandler