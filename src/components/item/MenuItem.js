import React from 'react';
import styles from './MenuItem.module.scss';
import classNames from 'classnames/bind';
import { DBImageFormat, numberFormat } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import ErrorCoverImage from '../asset/ErrorCoverImage';
import Noimage from '../svg/noimage.png';
import CoverImage from '../asset/CoverImage';

const cx = classNames.bind(styles);

const MenuItem = (props) => {
    return (
        <ButtonBase className={styles['menu-item']} onClick={props.onClick}>
            <div className={styles['menu-img']}>
                {/* <ErrorCoverImage className={styles['img']} src={props.item_img !== "[]" ? DBImageFormat(props.item_img)[0] : Noimage} alt={"메뉴 이미지"} /> */}
                <CoverImage className={styles['img']} src={props.item_img !== "[]" ? DBImageFormat(props.item_img)[0] : Noimage} vertical_rate={"75%"} />
            </div>
            <div className={cx('menu-info', 'pd-box')}>
                <div className={styles['menu-name']}>{props.item_name}</div>
                <div className={styles['menu-price']}>
                    {numberFormat(props.item_price)}원 ~
                </div>
            </div>
        </ButtonBase>
    );
};

export default React.memo(MenuItem);
