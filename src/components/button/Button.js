import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';

const cx = classNames.bind(styles);

// fixed button
const Button = ({ title, onClick, toggle }) => {
    return (
        <ButtonBase className={cx('btn', { on: toggle })} onClick={toggle ? onClick : ()=>{}}>
            {title}
        </ButtonBase>
    );
};

export default Button;
