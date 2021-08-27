import React, { useEffect, useState, useCallback } from 'react';
// route
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
// style
import styles from './OrderComplete.module.scss';
import classNames from 'classnames/bind';

// components
import { Button } from '@material-ui/core';
import DetailOrderItemList from '../../components/order/DetailOrderItemList';
import PhraseServiceModal from '../../components/modal/PhraseServiceModal';

// hooks
import { useModal } from '../../hooks/useModal';
import { useStore } from '../../hooks/useStore';
import { useSelector } from 'react-redux';

// api
import { getDetailOrderView } from '../../api/order/orderItem';
import { noAuthOrderView } from '../../api/noAuth/order';
import Loading from '../../components/asset/Loading';

//lib
import { numberFormat, stringToTel } from '../../lib/formatter';

const cx = classNames.bind(styles);
const payments = ['페이플 간편결제', '계좌이체', '만나서 결제', '무통장 입금'];
const pay_type = ['card', 'transfer', 'meet', 'bank'];

const OrderCompleteContainer = ({ order_number, query, modal }) => {
    const user_token = useStore(false);
    const { user } = useSelector((state) => state.auth);
    const company = useSelector(state => state.company.company);
    const openModal = useModal();
    const history = useHistory();
    // const [phraseOpen, setPhraseOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    // const [error, setError] = useState(false);
    const [orders, setOrders] = useState(null);
    const [type, setType] = useState(null);
    // const [payinfo, setPayInfo] = useState(null);
    // const [payple_info, setPaypleInfo] = useState(null);

    // const handlePhraseOpen = () => setPhraseOpen(true);
    // const handlePhrasetClose = () => setPhraseOpen(false);

    const onOpenModal = () =>
        history.push(Paths.ajoonamu.order_complete + '/phrase' + query);
    const onCloseModal = () => history.goBack();

    const onClickHome = () => {
        history.push(Paths.index);
    };

    const getPaymentType = (type) => {
        switch (type) {
            case pay_type[0]:
                return payments[0];
            case pay_type[1]:
                return payments[1];
            case pay_type[2]:
                return payments[2];
            case pay_type[3]:
                return payments[3];
            default:
                return payments[0];
        }
    };

    const getOrderInfo = useCallback(async () => {
        setLoading(true);
        try {
            let res = null;
            if (user_token) {
                res = await getDetailOrderView(user_token, order_number);
            } else {
                res = await noAuthOrderView(order_number);
            }
            const { orders } = res;
            if (orders === undefined || orders === null) {
                openModal(
                    '주문번호가 존재하지 않습니다.',
                    '주문번호를 확인해주세요.',
                    () => history.replace('/'),
                    () => history.replace('/'),
                );
                setSuccess(false);
            } else {
                setOrders(orders);
                setSuccess(true);
                setType(getPaymentType(orders.settle_case));
                openModal(
                    '문구 서비스를 신청하시겠습니까?',
                    '',
                    onOpenModal,
                    () => {},
                    true,
                );
            }
        } catch (e) {
            openModal(
                '주문번호가 존재하지 않습니다.',
                '주문번호를 확인해주세요.',
                () => history.replace('/'),
                () => history.replace('/'),
            );
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, openModal, order_number, user_token]);

    useEffect(() => {
        if (!order_number) {
            history.replace('/');
        } else {
            getOrderInfo();
        }
    }, [order_number, getOrderInfo, history]);

    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    {success && (
                        <div className={styles['container']}>
                            <div className={styles['content']}>
                                <div className={styles['title']}>
                                    주문이 완료되었습니다.
                                </div>
                                <div className={styles['order-number']}>
                                    주문번호: {orders.order_id}
                                </div>
                                <div className={styles['msg']}>
                                    {orders.info[0].s_name}님, 저희 샌달
                                    딜리버리 서비스를 <br />
                                    이용해주셔서 감사합니다.
                                    <br />
                                    {type === payments[3] && 
                                        <div className={styles['bank-info']}>
                                            <div className={styles['bank-box']}>
                                                <div className={styles['bank-name']}>
                                                    예금주명
                                                </div>
                                                <div className={styles['bank-value']}>
                                                    {company && company.company_bankuser}
                                                </div>
                                            </div>
                                            <div className={styles['bank-box']}>
                                                <div
                                                    className={styles['bank-name']}
                                                >
                                                    입금은행
                                                </div>
                                                <div
                                                    className={styles['bank-value']}
                                                >
                                                    {company && company.company_bankname}
                                                </div>
                                            </div>
                                            <div className={styles['bank-box']}>
                                                <div
                                                    className={styles['bank-name']}
                                                >
                                                    입금계좌
                                                </div>
                                                <div
                                                    className={styles['bank-value']}
                                                >
                                                    {company && company.company_banknum}
                                                </div>
                                            </div>
                                        </div>  
                                    }
                                    <div className={styles['no-auth']}>
                                        (비회원 주문시 주문내역 확인이 어려울 수
                                        있습니다.)
                                    </div>
                                </div>
                            </div>
                            <div className={styles['order-list']}>
                                <div className={styles['title']}>주문상품</div>
                                <div className={styles['list']}>
                                    <DetailOrderItemList
                                        info={orders.info}
                                        items={orders.items}
                                    />
                                </div>
                                <div className={cx('title', 'between')}>
                                    <div>배달 정보</div>
                                    <div className={styles['order-type']}>
                                        {orders.info[0].order_type === 'reserve'
                                            ? '예약주문'
                                            : '배달주문'}
                                    </div>
                                </div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={orders.info[0].r_name}
                                        value2={`${orders.s_addr1} ${orders.s_addr2}`}
                                        value3={stringToTel(
                                            orders.info[0].r_hp,
                                        )}
                                    />
                                </div>
                                <div className={styles['title']}>주문정보</div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={orders.info[0].s_name}
                                        value2={stringToTel(
                                            orders.info[0].s_hp,
                                        )}
                                        value3={user && user.email}
                                    />
                                    {orders && orders.info[0].cancel_reason && <p className={styles['reject-reason']}>
                                        거절 사유: {orders.info[0].cancel_reason}
                                    </p>}
                                </div>
                                <div className={styles['title']}>매장정보</div>
                                <div className={styles['list']}>
                                    <UserInfo
                                        value1={orders.shop_name}
                                        value2={`${orders.shop_addr1} ${orders.shop_addr2}`}
                                        value3={stringToTel(orders.shop_hp)}
                                    />
                                </div>
                                <div className={styles['title']}>결제정보</div>
                                <div className={styles['list']}>
                                    <PaymentInfo
                                        text={'주문번호'}
                                        value={orders.order_id}
                                    />
                                    <PaymentInfo
                                        text={'주문일시'}
                                        value={orders && (orders.receipt_time ? orders.receipt_time : '미완료 결제')}
                                    />
                                    <PaymentInfo
                                        text={'결제방식'}
                                        value={type}
                                    />
                                    <PaymentInfo
                                        text={'결제금액'}
                                        value={`${numberFormat(
                                            orders.receipt_price,
                                        )}원`}
                                    />
                                    <PaymentInfo
                                        text={'입금자명'}
                                        value={orders.info[0].s_name}
                                    />
                                    {/* <PaymentInfo text={'입금계좌'} value={'국민은행 12345-67-89000 아주나무'} />
                                <PaymentInfo text={'가상계좌 유효기간'} value={'2020년 06월 09일 00:00:00'} /> */}
                                </div>
                                <div className={styles['button-box']}>
                                    <Button
                                        className={styles['btn']}
                                        onClick={onOpenModal}
                                    >
                                        문구 서비스 신청
                                    </Button>
                                    <Button
                                        className={cx('btn', { on: true })}
                                        onClick={onClickHome}
                                    >
                                        완료
                                    </Button>
                                </div>
                            </div>
                            <PhraseServiceModal
                                open={modal === 'phrase'}
                                handleClose={onCloseModal}
                                order_number={order_number}
                                token={user_token}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};
const UserInfo = ({ value1, value2, value3 }) => (
    <>
        <div className={styles['name']}>{value1}</div>
        <div className={styles['user-info']}>{value2}</div>
        <div className={styles['user-info']}>{value3}</div>
    </>
);
const PaymentInfo = ({ text, value }) => (
    <div className={styles['payment-info']}>
        <div className={styles['info']}>{text}</div>
        <div className={styles['value']}>{value}</div>
    </div>
);

export default OrderCompleteContainer;
