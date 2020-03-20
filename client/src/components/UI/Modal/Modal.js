import React from 'react';
import classes from './Modal.module.css';

const Modal = (props) => {
    return (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>

                {props.children}
            </div>
            <button onClick={props.closePopup}>X</button>
        </div>
    );
}

export default Modal;