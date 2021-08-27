import React from 'react';
import styles from './Toast.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

export default function Toast({ on, msg }) {
    return <div className={cx('snackbar', { show: on })}>{msg}</div>;
}
