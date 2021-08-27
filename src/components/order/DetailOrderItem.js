import React from 'react';
import styles from './DetailOrder.module.scss';
import { DBImageFormat, numberFormat } from '../../lib/formatter';
import ErrorCoverImage from '../asset/ErrorCoverImage';
import Noimage from '../svg/noimage.png';
import { Link } from 'react-router-dom';
import { Paths } from '../../paths';

const DetailOrderItem = (props) => {
    
    const { item_name, item_option, item_price, item_img, qty, info } = props;
    return (
        <div className={styles['detail-order-item']}>
            <div className={styles['menu-img']}>
                <Link to={Paths.ajoonamu.product + '?item_id=' + info.item_id}>
                    <ErrorCoverImage
                        className={styles['img']}
                        src={item_img !== '[]' ? DBImageFormat(item_img)[0] : Noimage}
                        alt={'메뉴 이미지'}
                    />
                </Link>
            </div>
            <div className={styles['menu-info']}>
                <div className={styles['menu-name']}>{item_name}</div>
                <div className={styles['menu-options']}>
                    <div className={styles['addition']}>
                        추가 옵션: {item_option ? item_option : '없음'}
                    </div>
                    <div className={styles['counter']}>
                        &nbsp; 수량: {qty}개
                    </div>
                </div>
                <div className={styles['menu-price']}>
                    {numberFormat(item_price)}원
                </div>
            </div>
        </div>
    );
};

export default React.memo(DetailOrderItem);
