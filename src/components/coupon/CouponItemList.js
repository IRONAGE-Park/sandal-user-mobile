import React from 'react';
import styles from './Coupon.module.scss';
import CouponItem from './CouponItem';

const CouponItemList = ({cp_list }) => {
    const list = cp_list.map((cp) => (
        <CouponItem key={cp.cp_id} item={cp} />
    ));

    return <div className={styles['coupon-list']}>{list}</div>;
};

export default CouponItemList;
