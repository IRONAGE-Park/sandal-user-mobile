import React from 'react';
import styles from './Coupon.module.scss';
import UseCouponItem from './UseCouponItem';

const UseCouponItemList = ({cp_list}) => {

    const list =cp_list.map((item)=>(
        <UseCouponItem key={item.cp_id} item={item}/>
    ))
    return (
        <div className={styles['coupon-list']}>
            {list}
        </div>
    );
};
export default UseCouponItemList;
