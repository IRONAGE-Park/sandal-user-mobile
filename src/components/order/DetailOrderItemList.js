import React from 'react';
import DetailOrderItem from './DetailOrderItem';
const DetailOrderItemList = ({ items, info }) => {
    const list = items.map((item, index) => (
        <DetailOrderItem {...item} info={info[index]} key={index} />
    ));
    return <>{list}</>;
};

export default DetailOrderItemList;
