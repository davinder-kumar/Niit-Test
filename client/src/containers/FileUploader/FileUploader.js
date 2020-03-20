import React, { useState } from 'react'
import { socketConnect } from 'socket.io-react';
import './FileUploder.css'

const FileUploader = (props) => {
    const [percentage, setPercentage] = useState(0)
    const [progress, SetProgress] = useState(0)

    const onChange = (event) => {
        event.persist()
        setPercentage(0)
        SetProgress(0)

        var file = '';
        file = event.target.files[0]
        if (!file) {
            return false;
        }
        props.socket.emit('Start', { 'Name': file.name, 'Size': file.size });
        var fileReader = new FileReader();

        fileReader.onload = (evt) => {
            if (event.target.files[0].name !== file.name)
                return false;
            let arrayBuffer = evt.target.result;
            props.socket.emit('Upload', {
                Name: file.name,
                type: file.type,
                size: file.size,
                Data: arrayBuffer
            });
        }

        props.socket.on('MoreData', function (data) {
            UpdateBar(data['Percent']);
            var Place = data['Place'] * 524288; //The Next Blocks Starting Position
            var NewFile = file.slice(Place, Place + Math.min(524288, (file.size - Place)));
            fileReader.readAsBinaryString(NewFile);
        });

        const UpdateBar = (percent) => {
            SetProgress(percent)
            setPercentage((Math.round(percent * 100) / 100))
        }

        props.socket.on('Done', function (data) {
            SetProgress(100)
            setPercentage(100)
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