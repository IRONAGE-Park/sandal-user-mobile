import React, { useState, useEffect, useCallback, useReducer } from 'react';
import styles from './BottomNav.module.scss';
import classNames from 'classnames/bind';
import { Link, useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import {
    BottomNavHome,
    BottomNavCoupon,
    BottomNavOrderlist,
    BottomNavMypage,
} from 'components/svg/bottom-nav';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import deliveryImage from '../svg/bottom-nav/delivery.svg';
import deliveryCloseImage from '../svg/bottom-nav/delivery-close.svg';

import { withRouter } from 'react-router-dom';
import { Backdrop } from '@material-ui/core';

const cx = classNames.bind(styles);

const initState = {
    home: false,
    coupon: false,
    order: false,
    mypage: false,
};

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        // color: '#007246'
    },
}));

const tabReducer = (state, action) => {
    switch (action.type) {
        case 'HOME':
            return {
                home: true,
                coupon: false,
                order: false,
                mypage: false,
            };
        case 'COUPON':
            return {
                home: false,
                coupon: true,
                order: false,
                mypage: false,
            };
        case 'ORDER':
            return {
                home: false,
                coupon: false,
                order: true,
                mypage: false,
            };
        case 'MYPAGE':
            return {
                home: false,
                coupon: false,
                order: false,
                mypage: true,
            };
        default:
            return state;
    }
};

const BottomNav = (props) => {
    const [tab, dispatchTab] = useReducer(tabReducer, initState);
    const {location} = props;

    const onUpdateTab = useCallback(() => {
        if (location.pathname === '/' || location.pathname === '/shop') {
            dispatchTab({ type: 'HOME' });
        } else if (location.pathname === '/coupon') {
            dispatchTab({ type: 'COUPON' });
        } else if (
            location.pathname === '/mypage' ||
            location.pathname === '/account' ||
            location.pathname.indexOf('support') !== -1 ||
            location.pathname.indexOf('event') !== -1
        ) {
            dispatchTab({ type: 'MYPAGE' });
        } else if (location.pathname === '/order_list') {
            dispatchTab({ type: 'ORDER' });
        }
    }, [props]);

    useEffect(() => {
        onUpdateTab();
    }, [onUpdateTab]);


    const history = useHistory();

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = () => {};
    const onClickHome = () => {
        history.push(Paths.index);
    };
    const onClickCoupon = () => {
        history.push(`${Paths.ajoonamu.coupon}?tab=0`);
    }
    const onClickOrderList = () => {
        history.push(`${Paths.ajoonamu.order_list}?tab=0`)
    }
    const onClickMyPage = () => {
        history.push(`${Paths.ajoonamu.mypage}`);
    };

    return (
        <>
            <div className={styles['bottom-nav']}>
                <div className={styles['pd-box']}>
                    <div className={styles['nav-list']}>
                        <IconButton className={styles['nav-item']} onClick={onClickHome}>
                            <div className={styles['icon']}>
                                <BottomNavHome active={tab.home} />
                            </div>
                            <div className={cx('menu-name', { active: tab.home })}>
                                홈
                            </div>
                        </IconButton>
                        <IconButton className={styles['nav-item']} onClick={onClickCoupon}>
                            <div className={styles['icon']}>
                                <BottomNavCoupon active={tab.coupon} />
                            </div>
                            <div className={cx('menu-name', { active: tab.coupon })}>
                                쿠폰
                            </div>
                        </IconButton>
                        <div className={cx('nav-item', 'order')}>
                            <input
                                type="checkbox"
                                className={styles['menu-open']}
                                checked={open}
                                onChange={handleChange}
                            />
                            <div className={styles['menu-open-button']} onClick={handleOpen} >
                                <div className={cx('menu', { visible: !open })}>
                                    <img src={deliveryImage} alt="bottom-nav-delivery" />
                                </div>
                                <div className={cx('menu', { visible: open })}>
                                    <img src={deliveryCloseImage} alt="bottom-nav-delivery" />
                                </div>
                            </div>
                            <Link to={`${Paths.ajoonamu.shop}?menu=0`} className={styles["menu-item"]} onClick={handleClose}>예약주문</Link>
                            <Link to={`${Paths.ajoonamu.breakfast}?menu=0`}className={styles["menu-item"]} onClick={handleClose}>정기조식</Link>
                        </div>
                        <IconButton className={styles['nav-item']} onClick={onClickOrderList}>
                            <div className={styles['icon']}>
                                <BottomNavOrderlist active={tab.order} />
                            </div>
                            <div className={cx('menu-name', { active: tab.order })}>
                                주문내역
                            </div>
                        </IconButton>
                        <IconButton className={styles['nav-item']} onClick={onClickMyPage}>
                            <div className={styles['icon']}>
                                <BottomNavMypage active={tab.mypage} />
                            </div>
                            <div className={cx('menu-name', { active: tab.mypage })}>
                                마이페이지
                            </div>
                        </IconButton>
                    </div>
                </div>
            </div>
            <Backdrop className={useStyles().backdrop} open={open} onClick={handleClose} />
        </>
    );
};

export default withRouter(BottomNav);
