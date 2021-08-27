import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import styles from './Coupon.module.scss';
import classNames from 'classnames/bind';

//components
import TabMenu from '../../components/tab/TabMenu';
import CouponItemList from '../../components/coupon/CouponItemList';
import DownCouponList from '../../components/coupon/DownCouponList';
import UseCouponItemList from '../../components/coupon/UseCouponItemList';
import Loading from '../../components/asset/Loading';
import Message from '../../components/message/Message';
import { Button } from '@material-ui/core';
import BottomModal from '../../components/nav/BottomModal';
import { Swiper, SwiperSlide } from 'swiper/react';

import date from 'components/svg/title-bar/date.svg';
import { IconButton } from '@material-ui/core';

//api
import {
    getMyCoupons,
    getDownloadCpList,
    downloadCoupon,
    couponInput,
    getUseCpList,
} from '../../api/coupon/coupon';

//hooks
import produce from 'immer';

//lib
import { useStore } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';
import { calculateDate } from '../../lib/calculateDate';

const cx = classNames.bind(styles);
// 스와이퍼 테스트
const tabInit = [
    {
        url: `${Paths.ajoonamu.coupon}?tab=0`,
        name: '내쿠폰',
    },
    {
        url: `${Paths.ajoonamu.coupon}?tab=1`,
        name: '쿠폰받기',
    },
    {
        url: `${Paths.ajoonamu.coupon}?tab=2`,
        name: '쿠폰사용내역',
    },
];

const CouponConatiner = ({ tab = '0' }) => {
    const openModal = useModal();
    const SWIPER = useRef(null);
    const history = useHistory();
    const myCouponTitle = useRef(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(
        calculateDate(new Date(), 7, 'DATE'),
    );
    const [endDate, setEndDate] = useState(new Date());
    const user_token = useStore();

    const [index, setIndex] = React.useState(parseInt(tab));
    const [cp_list, setCpList] = useState([]);
    const [user_input_cp, setUserInputCp] = useState('');
    const [down_cp_list, setDownCpList] = useState([]);
    const [use_cp_list, setUseCpList] = useState([]);
    const [show, setShow] = useState(false);

    const [select, setSelect] = useState(0);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onChangeUserInputCp = (e) => setUserInputCp(e.target.value);

    const onScroll = useCallback(
        (e) => {
            if (index === 0) {
                const scrollTop =
                    ('scroll', e.srcElement.scrollingElement.scrollTop);
                if (scrollTop > 210) setShow(true);
                if (scrollTop < 250) setShow(false);
            }
        },
        [index],
    );

    const onChangeTabIndex = (e, value) => {
        setIndex(value);
        SWIPER.current.slideTo(value, 300);
    };
    const onChangeSwiperIndex = useCallback(
        (index) => {
            setIndex(index);
            history.replace(`${Paths.ajoonamu.coupon}?tab=${index}`);
        },
        [history],
    );
    const getMyCouponList = async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getMyCoupons(user_token);
                setCpList(res);
                setSuccess(true);
            } catch (e) {
                setSuccess(false);
            }
        }
        setLoading(false);
    };

    // 다운로드 가능한 쿠폰 리스트
    const getDownCouponList = async () => {
        if (user_token) {
            try {
                const res = await getDownloadCpList(user_token);
                setDownCpList(res);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const getUseCouponList = async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getUseCpList(user_token, startDate, endDate);
                setUseCpList(res);
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    }

    const callCouponDownload = useCallback(
        async (cp) => {
            try {
                const res = await downloadCoupon(user_token, cp.cz_id);
                if (
                    res.data.msg === '이미 해당 쿠폰존에서 받은 쿠폰이력이 있습니다.'
                ) {
                    openModal('이미 다운로드 한 쿠폰입니다.');
                } else if (res.data.msg === '성공') {
                    openModal('다운로드 성공했습니다.');
                    getMyCouponList();
                } else {
                    openModal('다운로드에 문제가 발생했습니다!', '잠시 후에 다시 시도해 주세요.');
                    getMyCouponList();
                }
                const idx = down_cp_list.findIndex(
                    (item) => item.cz_id === cp.cz_id,
                );
                setDownCpList(
                    produce(down_cp_list, (draft) => {
                        draft[idx].check = true;
                    }),
                );
            } catch (e) {}
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user_token, down_cp_list, openModal, cp_list],
    );

    const inputCoupon = useCallback(async () => {
        if (user_input_cp !== '') {
            try {
                const res = await couponInput(user_token, user_input_cp);
                if (res.data.msg === '성공') {
                    openModal('쿠폰 등록이 완료되었습니다.');
                    getMyCouponList();
                } else if (res.data.msg === '이미 발급된 쿠폰입니다.') {
                    openModal('쿠폰번호를 확인해주세요', res.data.msg);
                } else if (
                    res.data.msg ===
                    '해당 쿠폰번호에 맞는 쿠폰이 존재하지 않습니다.'
                ) {
                    openModal('쿠폰번호를 확인해주세요', res.data.msg);
                }
            } catch (e) {}
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, user_input_cp, openModal]);


    useEffect(() => {
        getMyCouponList();
        getDownCouponList();
        getUseCouponList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    useEffect(() => {
        setShow(false);
    }, [index]);

    useEffect(() => {
        window.scrollTo(0, 0);
        index === 0 && window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [index, onScroll]);


    useEffect(() => {
        switch (select) {
            case 0:
                setStartDate(calculateDate(endDate, 7, 'DATE'));
                break;
            case 1:
                setStartDate(calculateDate(endDate, 1, 'MONTH'));
                break;
            case 2:
                setStartDate(calculateDate(endDate, 3, 'MONTH'));
                break;
            case 3:
                setStartDate(calculateDate(endDate, 6, 'MONTH'));
                break;
            default:
                break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [select]);

    return (
        <>
            {success && (
                <>
                    {loading ? (
                        <Loading open={true} />
                    ) : (
                        <>
                            <div className={cx('title', { show: show })}>
                                 보유쿠폰 <b>{cp_list.length}</b>개
                            </div>
                            <TabMenu
                                tabs={tabInit}
                                index={index}
                                onChange={onChangeTabIndex}
                                center={false}
                            />
                            <div className={cx('container')}>
                                <Swiper
                                    className={styles['swiper']}
                                    initialSlide={index}
                                    slidesPerView={1}
                                    onSlideChange={swiper => onChangeSwiperIndex(swiper.activeIndex)}
                                    autoHeight={true}
                                    onSwiper={(swiper) => SWIPER.current=swiper}
                                >
                                    <SwiperSlide className={styles['swiper-slide']}>
                                        <div className={cx('coupon-title', 'pd-box')}>
                                            쿠폰 코드 입력
                                        </div>
                                        <div className={cx('coupon-form', 'pd-box')}>
                                            <input
                                                className={styles['code-input']}
                                                type="text"
                                                value={user_input_cp}
                                                onChange={onChangeUserInputCp}
                                                placeholder='쿠폰 코드를 입력해주세요'
                                            />
                                            <Button
                                                className={styles['submit-btn']}
                                                onClick={inputCoupon}
                                            >
                                                쿠폰등록
                                            </Button>
                                        </div>
                                        <div className={cx('coupon-title', 'pd-box')} ref={myCouponTitle}>
                                            보유쿠폰 <b>{cp_list.length}</b>개
                                        </div>
                                        <div className={cx('coupon-list', 'pd-box')}>
                                            {cp_list.length !== 0 ? <CouponItemList cp_list={cp_list} />
                                            : <Message msg={'보유하고 있는 쿠폰이 없습니다'} />}
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className={styles['swiper-slide']}>
                                        <div className={cx('coupon-list', 'pd-box')}>
                                            {down_cp_list.length !== 0 ? (
                                                <DownCouponList
                                                    check={true}
                                                    cp_list={down_cp_list}
                                                    onClick={callCouponDownload}
                                                />
                                            ) : (
                                                <Message msg={'받을 수 있는 쿠폰이 존재하지 않습니다.'} />
                                            )}
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className={styles['swiper-slide']}>
                                        <div className={cx('use-history', 'pd-box')}>
                                            <select value={select} onChange={e => setSelect(e.target.value) } className={styles['date-selector']}>
                                                <option value={0}>최근 1주일</option>
                                                <option value={1}>최근 1개월</option>
                                                <option value={2}>최근 3개월</option>
                                                <option value={3}>최근 6개월</option>
                                            </select>
                                            <IconButton
                                                className={cx('date-button', { on: tab === '2' })}
                                                onClick={handleOpen}
                                            >
                                                <img src={date} alt="date" />
                                            </IconButton>
                                        </div>
                                        <div className={cx('coupon-list', 'pd-box')}>
                                            {use_cp_list.length !== 0 ? <UseCouponItemList cp_list={use_cp_list} />
                                            : <Message msg="사용하신 쿠폰이 없습니다." />}
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </>
                    )}
                    <BottomModal
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        select={select}
                        setSelect={setSelect}
                        open={open}
                        handleClose={handleClose}
                        // onClick={getOrderItems}
                        onClick={getUseCouponList}
                    />
                </>
            )}
        </>
    );
};

export default CouponConatiner;
