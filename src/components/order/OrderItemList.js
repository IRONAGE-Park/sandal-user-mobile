import React from 'react';

import OrderItem from './OrderItem';
const OrderItemList = ({ order_list, onClick }) => {
    const list = order_list.map((order) => (
        <OrderItem
            {...order}
            key={order.order_id}
            onClick={() => {
                onClick(order.order_id);
            }}
        />
    ));
    return <>{list}</>;
};
export default OrderItemList;
