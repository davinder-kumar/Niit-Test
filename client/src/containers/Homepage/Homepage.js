import React, { useEffect, useState } from 'react';
import axios from '../../axios-videos'
import classes from './Homepage.module.css'
import Modal from '../../components/UI/Modal/Modal'
import { Link } from 'react-router-dom'
const Homepage = () => {
    const [videos, updateVideos] = useState([])
    const [unmutatedVideos, setUnMutatedVideos] = useState([])
    const [thumbSize, setThumbSize] = useState('smallThumb')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [currentVideo, setCurrentVideo] = useState(null)
    useEffect(() => {
        setLoading(true)
        axios.get("/videos")
            .then(response => {
                setLoading(false)
                let data = []
                if (response.data.length) {
                    response.data.forEach(video => {
                        // return
                        let chunks = {}
                        chunks.videopath = video.video
                        chunks.name = video.name
                        chunks.smallThumb = video.thumbs[0].small
                        chunks.largeThumb = video.thumbs[1].large
                        data.push(chunks)
                    })

                    updateVideos(data)
                    setUnMutatedVideos(data)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }, [])

    const playVideoHandler = (video, event) => {
        event.preventDefault()
        setShowModal(true)
        setCurrentVideo(video)
    }

    let data = <p>No data found!</p>
    if (loading) {
        data = <p>Loading...</p>
    }
    if (videos.length) {
        data = videos.map((video, index) => {
            return (
                <div key={index} className={classes.gallery}>
                    <Link onClick={playVideoHandler.bind(this, video.videopath)}
                        to={process.env.REACT_APP_UPLODAS_VIDEOS + "/" + video.videopath}>
                        <img src={process.env.REACT_APP_UPLODAS_THUMBS + "/" + video[thumbSize]}
                            alt={video.name} />
                    </Link>
                    <div className={classes.desc}>{video.name}</div>
                </div>
            )
        })
    }

    const onClosePopupHandler = () => {
        setShowModal(false)
    }
    const toggleThumbsHandler = () => {
        setThumbSize((prevState) => {
            return prevState === 'smallThumb' ? "largeThumb" : 'smallThumb'
        })
    }

    const searchVideosHandler = (event) => {

        if (unmutatedVideos.length) {
            const filteredResults = unmutatedVideos.filter(video => {
                const name = video.name.toUpperCase()
                return name.includes(event.target.value.toUpperCase())
            })
            updateVideos(filteredResults)
        }
    }

    return (
        <div className={classes.homepage}>
            <button className={classes.button} onClick={toggleThumbsHandler}>Toggle Thumbs Size</button>
            <input className={classes.searchBar} onChange={searchVideosHandler} type="text" placeholder="Search videos" />
            <div>
                {data}

                {showModal ?
                    <Modal closePopup={onClosePopupHandler} >
                        <video width="320" height="240" controls autoplay>
                            <source src={process.env.REACT_APP_UPLODAS_VIDEOS + "/" + currentVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                    </video>
                    </Modal> : null}
            </div>
        </div>

    );

}

export default Homepage;
