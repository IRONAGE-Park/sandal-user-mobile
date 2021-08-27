import React from 'react';
import OrderReviewContainer from '../../containers/order/OrderReviewContainer';
import qs from 'qs';

export default function OrderReview({ location }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const { review_id, order_id } = query;
    return <OrderReviewContainer review_id={review_id} order_id={order_id} />;
}
