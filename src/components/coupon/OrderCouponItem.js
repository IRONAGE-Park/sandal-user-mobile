import React from 'react';
import classNames from 'classnames/bind';

import { ButtonBase } from '@material-ui/core';

import styles from './OrderCoupon.module.scss';
import Check from '../svg/coupon/Check';
import { numberFormat } from '../../lib/formatter';

const cx = classNames.bind(styles);

const OrderCouponItem = (props) => {
    const {
        // cp_datetime,
        cp_end,
        // cp_id,
        cp_minimum,
        cp_price,
        cp_start,
        cp_subject,
        cp_target,
        // cp_use,
        // cp_use_date,
        // cz_id,
        // user_id,
        select,
    } = props.item

    return (
        <ButtonBase className={cx('coupon-item', { select: select})} onClick={props.onClick}>
            <div className={styles['check']}>
                <OrderCouponCheck select={select} />
            </div>
            <div className={styles['info']}>
                <div className={styles['pd-box']}>
                    <OrderCouponEventName event_name={cp_subject} />
                    <OrderCouponSale sale={cp_price} />
                    <OrderCouponEventSub sub_name={`최소주문금액 ${numberFormat(cp_minimum)}원`} />
                    <OrderCouponDate date={`${cp_start} - ${cp_end}`} />
                </div>
            </div>
        </ButtonBase>
    );
};
const OrderCouponEventName = ({ event_name }) => <div className={styles['event-name']}>{event_name}</div>;
const OrderCouponSale = ({ sale }) => <div className={cx('text', 'sale')}>{numberFormat(sale)}원 할인</div>;
const OrderCouponEventSub = ({ sub_name }) => <div className={cx('text', 'sub-name')}>{sub_name}</div>;
const OrderCouponDate = ({ date }) => <div className={cx('text', 'date')}>{date}</div>;
const OrderCouponCheck = ({ select }) => <Check select={select} />

export default React.memo(OrderCouponItem);
