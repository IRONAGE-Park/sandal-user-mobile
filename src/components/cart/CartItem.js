import React from 'react';
import PropsTypes from 'prop-types';
import styles from './Cart.module.scss';
import Counter from 'components/counter/Counter';

import { DBImageFormat, numberFormat } from '../../lib/formatter';
import { IconButton } from '@material-ui/core';
import Cross from '../svg/counter/Cross';
import ErrorCoverImage from '../asset/ErrorCoverImage';
import Noimage from '../svg/noimage.png';

// 메뉴이름, 추가옵션
const CartItem = (props) => {
    const { item_name, item_price, item_quanity, cart_id, item_img } = props.item;
    const { id } = props;
    const options = props.options;

    const totalPrice = () => {
        let price = item_price * item_quanity;
        for (let i = 0; i < options.length; i++) {
            price += options[i].option_price * item_quanity; // 만약 추가수량은 추가되지 않는거라면 * item_qunity 삭제
        }
        return price;
    };

    return (
        <div className={styles['cart-item']}>
            <div className={styles['pd-box']}>
                <div className={styles['item-box']}>
                    <div className={styles['item']}>
                        <div className={styles['item-img']}>
                            
                            <ErrorCoverImage className={styles['img']} src={item_img !== "[]" ? DBImageFormat(item_img)[0] : Noimage} alt={"메뉴 이미지"} />
                        </div>
                        <div className={styles['item-info']}>
                            <div className={styles['bar']}>
                                <div className={styles['name']}>{item_name}</div>
                                <IconButton className={styles['delete']}
                                    onClick={() => props.handleDelete([cart_id])}
                                >
                                    <Cross color="#777" angle={45} />
                                </IconButton>
                            </div>
                            <div className={styles['options']}>
                                추가선택: {options.length !== 0 ? options.map(op => op.option_name) : "없음"}
                            </div>
                            <div className={styles['count-price']}>
                                <div className={styles['count']}>
                                    <Counter value={item_quanity} 
                                        onChange={e => props.handleChange(id, numberFormat(e.target.value))}
                                        onIncrement={()=>props.handleIncrement(id)}
                                        onDecrement ={()=>props.handleDecrement(id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['price']}>
                        {numberFormat(totalPrice())} 원
                    </div>
                </div>
            </div>
        </div>
    );
};

CartItem.PropsTypes = {
    isChecked: PropsTypes.bool,
};
CartItem.defaultProps = {
    isChecked: false,
};

export default React.memo(CartItem);
