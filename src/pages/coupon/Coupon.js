import React from 'react';
import CouponContainer from 'containers/coupon/CouponContainer';
import qs from 'qs';

const Coupon = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const tab = query.tab;
    return <CouponContainer tab={tab} />;
};
export default Coupon;
