import React from 'react';
import OrderContainer from 'containers/order/OrderContainer';

const Order = ({ match }) => {
    return <OrderContainer modal={match.params.modal} />;
}

export default Order;