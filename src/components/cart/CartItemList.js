import React from 'react';
import CartItem from './CartItem';

const CartItemList = (props) => {
    const list = props.carts.map((cart, index) => (
        <CartItem
            id={index}
            key={cart.item.cart_id}
            {...cart}
            handleChange={props.handleChange}
            handleCheckChild={props.handleCheckChild}
            handleIncrement={props.handleIncrement}
            handleDecrement={props.handleDecrement}
            handleDelete={props.handleDelete}
        />
    ));
    return <div>{list}</div>;
};

export default React.memo(CartItemList);
