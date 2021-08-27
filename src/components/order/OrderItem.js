import React from 'react';
import classnames from 'classnames/bind';
import styles from './Order.module.scss';
import { numberFormat } from '../../lib/formatter';
import { ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { calculateDay } from '../../lib/calculateDate';
import { Paths } from '../../paths';
import { useSelector } from 'react-redux';

const cn = classnames.bind(styles);

// 전제척인 주문 메뉴 아이템
const OrderItem = (props) => {
    const {
        receipt_time,
        items,
        total_price,
        send_cost,
        cp_price,
        point_price,
        receipt_price,
        review_id,
        order_id,
        info,
    } = props;
    const history = useHistory();
    const company = useSelector(state => state.company.company);    
    
    return (
        <div className={styles['order-item']}>
            <div className={styles['item']}>
                <div className={styles['menu']} onClick={props.onClick}>
                    <div className={styles['pd-box']}>
                        <div className={styles['date']}>{ receipt_time ? calculateDay(receipt_time) :
                        (info[0].settle_case === 'meet' ? '배송 접수' : company && `${company.company_bankname} ${company.company_banknum} ${company.company_bankuser}`)}</div>
                        <div className={styles['list']}>
                            <OrderMenuItemList items={items} />
                        </div>
                    </div>
                </div>
                <div className={styles['cost']}>
                    <div className={styles['pd-box']}>
                        <div className={styles['total']} onClick={props.onClick}>
                            <span>결제금액</span>
                            {numberFormat(receipt_price)}원
                        </div>
                        <div className={styles['sub']} onClick={props.onClick}>
                            주문금액 {numberFormat(total_price)}원 + 배송비{' '}
                            {numberFormat(send_cost)}원 - <br />
                            포인트 할인 {numberFormat(point_price)}원 - 쿠폰
                            할인 {numberFormat(cp_price)}원<br />
                        </div>
                        <div className={styles['button-area']}>
                            <ButtonBase disabled className={cn('button', 'order-type', info[0].od_status)}>
                                {info[0].od_status === "deposit_wait" && (info[0].settle_case === 'meet' ? '만나서 결제' : '입금 대기')}
                                {info[0].od_status === 'order_cancel' && (info[0].cancel_reason === null ? '주문 취소' : '주문 거절')}
                                {info[0].od_status === "order_apply" && '입금확인'}
                                {info[0].od_status === "shipping" && '배송중'}
                                {info[0].od_status === "delivery_complete" && '배달완료'}
                                {info[0].od_status === "order_complete" && '주문완료'}
                                {!info[0].od_status && "상태없음"}
                            </ButtonBase>
                            {(info[0].od_status === "order_complete"
                            || info[0].od_status === "delivery_complete")
                            && <ButtonBase className={cn('button', 'review', { new: review_id === null })}
                                onClick={() => history.push(
                                    Paths.ajoonamu.order_review + '?' + (review_id === null ? 'order_id=' + order_id : 'review_id=' + review_id)
                                )}
                            >
                                {review_id === null ? '리뷰작성' : '리뷰수정'}
                            </ButtonBase>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

//주문 메뉴 리스트
const OrderMenuItemList = ({ items }) => {
    const list = items.map((item, index) => (
        <OrderInfoItem
            item_name={item.item_name}
            item_option={item.item_option}
            item_price={item.item_price}
            item_qty ={item.qty}
            item_img = {item.item_img}
            key={index}
        />
    ));

    return <div className={styles['menu-item-list']}>{list}</div>;
};

//주문 메뉴 아이템 (개별)
const OrderInfoItem = ({ item_name, item_option, item_price,item_qty }) => {
    return (
        <div className={styles['menu-name']}>
            <div className={styles['name']}>{item_name} {item_qty}개</div>
            <div className={styles['options']}>
                추가선택 : {item_option ? item_option : '없음'} / 비용 :{' '}
                {numberFormat(item_price)}원
            </div>
        </div>
    );
};

export default React.memo(OrderItem);
