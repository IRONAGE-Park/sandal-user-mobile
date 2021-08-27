import React from 'react';
import OrderDetailContainer from 'containers/order/OrderDetailContainer';
import qs from 'qs';

export default function OrderDetail({ location }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const order_id = query.order_id;
    return <OrderDetailContainer order_id={order_id} />;
}
