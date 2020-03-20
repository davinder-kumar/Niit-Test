import React from 'react'
import Navigation from '../../components/UI/Navigation/Navigation'
const layout = (props) => {
    return (
        <>
            <Navigation />
            {props.children}
        </>

    )
}

export default layout