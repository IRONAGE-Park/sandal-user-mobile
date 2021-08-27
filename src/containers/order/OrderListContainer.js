import React, { useState, useEffect, useCallback } from 'react';
import styles from './OrderList.module.scss';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import TitleBar from 'components/titlebar/TitleBar';
import OrderItemList from '../../components/order/OrderItemList';
import BottomModal from '../../components/nav/BottomModal';
import date from 'components/svg/title-bar/date.svg';
import Message from 'components/message/Message';
import Loading from '../../components/asset/Loading';
import { IconButton } from '@material-ui/core';

import { getOrderList } from '../../api/order/orderItem';
import { useStore } from '../../hooks/useStore';
import { calculateDate } from '../../lib/calculateDate';

const OrderListContainer = () => {
    const [success, setSuccess] = useState(false);
    // const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [reserveList, setReserveList] = useState([]);
    const [startDate, setStartDate] = useState(
        calculateDate(new Date(), 7, 'DATE'),
    );
    const [endDate, setEndDate] = useState(new Date());
    const [select, setSelect] = useState(0);
    const user_token = useStore();
    const history = useHistory();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const getOrderItems = async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getOrderList(
                    user_token,
                    0,
                    100,
                    // (page - 1) * PAGE_PER_VIEW,
                    // PAGE_PER_VIEW,
                    startDate,
                    endDate,
                );
                const orders = res.orders ? res.orders : [];

                setReserveList(orders);
                setSuccess(true);
            } catch (e) {
                setSuccess(false);
            }
        }
        setLoading(false);
    };

    const onClickOrderItem = useCallback(
        (order_id) => {
            history.push(`${Paths.ajoonamu.order_detail}?order_id=${order_id}`);
        },
        [history],
    );

    useEffect(() => {
        // window.scrollTo(0,0);
        getOrderItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {success && (
                <>
                    <TitleBar title={'주문내역'}>
                        <IconButton
                            style={{
                                width: '40px',
                                height: '40px',
                                right: '-10px',
                            }}
                            onClick={handleOpen}
                        >
                            <img src={date} alt="date" />
                        </IconButton>
                    </TitleBar>
                    <div className={styles['header-shadow']}></div>
                    {loading ? (
                        <Loading open={true} />
                    ) : (
                        <div className={styles['container']}>
                            <div className={styles['swiper']}>
                                {reserveList.length !== 0 ? (
                                    <OrderItemList
                                        order_list={reserveList}
                                        onClick={onClickOrderItem}
                                    />
                                ) : (
                                    <Message
                                        src={true}
                                        msg={'주문 내역이 존재하지 않습니다.'}
                                        isButton={true}
                                        buttonName={'주문하러 가기'}
                                        onClick={() => {
                                            history.replace(Paths.ajoonamu.shop);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
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
                        onClick={getOrderItems}
                    />
                </>
            )}
        </>
    );
};

export default OrderListContainer;
