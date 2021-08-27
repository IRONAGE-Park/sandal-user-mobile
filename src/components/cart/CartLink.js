import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { Paths } from 'paths';
import styles from './Cart.module.scss';
import logo from '../svg/cart/cartlink.svg';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';

const cn = classnames.bind(styles);


export default function CartLink() {

    const [render, setRender] = useState(false);

    useEffect(() => {
        setRender(true);
    }, []);

    return (
        <Link to={Paths.ajoonamu.cart}>
            <IconButton className={cn('cart_link', { render })}>
                <img src={logo} alt="logo" />
            </IconButton>
        </Link>
    );
}
