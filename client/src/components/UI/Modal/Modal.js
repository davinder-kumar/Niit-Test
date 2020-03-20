import React from 'react';
import classes from './Modal.module.css';

const Modal = (props) => {
    return (
        <div className={classes.popup}>

            <div className={classes.popup_inner}>
                <button onClick={props.closePopup}>X</button>
                {props.children}

            </div>

        </div>
    );
}

export default Modal;