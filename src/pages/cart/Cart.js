import React from 'react';
import CartContainer from 'containers/cart/CartContainer';

const Cart = ({ match }) => {
    return <CartContainer modal={match.params.modal} />;
}

export default Cart;
