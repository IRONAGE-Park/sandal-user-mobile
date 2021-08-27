import React from 'react';
import styles from './LinkButton.module.scss';
import classNames from 'classnames/bind';
import './LinkButton.module.scss';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';

const cx = classNames.bind(styles);
//fixed button

const LinkButton = ({ title, onClick, toggle }) => (
    <Button className={styles['link-btn-container']}>
        <div className={cx('link-btn', { on: toggle })} onClick={toggle ? onClick: ()=>{}}>{title}</div>
    </Button>
);


LinkButton.propTypes = {
    title : propTypes.string,
    onClick : propTypes.func,
    toggle : propTypes.bool
}
LinkButton.defaultProps ={
    title : "button",
    onClick : () => {},
    toggle :false,
}

export default LinkButton; 