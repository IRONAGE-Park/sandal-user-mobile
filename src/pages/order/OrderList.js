import React from 'react';
import OrderListContainer from 'containers/order/OrderListContainer';
import qs from 'qs';

export default function OrderList({ location }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const tab = query.tab;
    return <OrderListContainer tab={tab} />;
}
