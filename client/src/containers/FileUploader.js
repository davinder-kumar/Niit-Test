import React, { useState, useEffect } from 'react'
// import { SocketProvider, socketConnect } from 'socket.io-react';
// import io from 'socket.io-client';
import { socketConnect } from 'socket.io-react';
import './FileUploder.css'

const FileUploader = (props) => {
    console.log(props)
    const [percentage, setPercentage] = useState(0)
    const [progress, SetProgress] = useState(0)
    const [MB, setMB] = useState(0)

    const onChange = (event) => {

        var file = event.target.files[0];
        // var slice = file.slice(0, 100000);
        var fileReader = new FileReader();
        // fileReader.readAsArrayBuffer(slice);

        fileReader.onload = (evt) => {
            // console.log(evt.target.result)
            let arrayBuffer = evt.target.result;
            props.socket.emit('Upload', {
                Name: file.name,
                type: file.type,
                size: file.size,
                Data: arrayBuffer
            });
        }
        props.socket.emit('Start', { 'Name': file.name, 'Size': file.size });


        props.socket.on('MoreData', function (data) {
            UpdateBar(data['Percent']);
            // console.log(file)
            var Place = data['Place'] * 524288; //The Next Blocks Starting Position
            // var NewFile; //The Variable that will hold the new Block of Data
            var NewFile = file.slice(Place, Place + Math.min(524288, (file.size - Place)));
            fileReader.readAsBinaryString(NewFile);
        });

        const UpdateBar = (percent) => {
            SetProgress(percent)
            setPercentage((Math.round(percent * 100) / 100))
            setMB(Math.round(((percent / 100.0) * file.size) / 1048576))
        }

        props.socket.on('Done', function (data) {
            var Content = "Video Successfully Uploaded !!"
            SetProgress(100)
            setPercentage(100)
            setMB(Math.round((file.size) / 1048576))
            // alert(Content)
        });


    }

    return (
        <div>
            <h2>Progress Bar</h2>
            <form id="upload_form" encType="multipart/form-data" method="post">
                <input type="file" onChange={onChange} /><br />
                <progress id="progressBar" value={percentage} max="100" style={{ width: '300px' }} ></progress>
            </form>
            {percentage === 100 ? <p>Upload Completed</p> : ""}
        </div>
    )
}

export default socketConnect(FileUploader)