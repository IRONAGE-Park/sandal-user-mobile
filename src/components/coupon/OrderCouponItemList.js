import React from 'react';
import styles from './OrderCoupon.module.scss';
import OrderCouponItem from './OrderCouponItem';

const OrderCouponItemList = (props) => {
    const list = props.cp_list.map((cp) => (
        <OrderCouponItem key={cp.cp_id} item={cp} onClick={()=>props.onClick(cp.cp_id,cp.cp_price,cp.cp_minimum)} id={cp.cp_id} />
    ));

    return <div className={styles['coupon-list']}>{list}</div>;
};

export default OrderCouponItemList;
