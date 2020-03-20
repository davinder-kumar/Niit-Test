import React from 'react'
import './Navigation.module.css'
import { routes } from '../../../routes'
import { Link } from 'react-router-dom'

const Navigation = () => {
    return (
        <ul>
            <li>
                <Link to={routes.home}>Video Gallery</Link>
            </li>
            <li>
                <Link to={routes.upload}>Upload Video</Link>
            </li>

        </ul>
    )
}
export default Navigation