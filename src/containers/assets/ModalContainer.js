import React from 'react';
/* Library */

import { useSelector } from 'react-redux';
/* Redux */

import Modal from '../../components/asset/Modal';
/* Components */

export default () => {
    const state = useSelector(state => state.modal);
    const { title, text, handleClick, open, confirm, handleClose } = state;
    return (
        <Modal
            confirm={confirm}
            title={title}
            text={text}
            handleClick={handleClick}
            open={open}
            handleClose={handleClose}
        />
    );
};
