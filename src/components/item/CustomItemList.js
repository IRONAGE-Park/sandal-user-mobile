import React from 'react';
import styles from './Custom.module.scss';
import CustomItem from './CustomItem';

//추천 메뉴 리스트를 렌더할 컴포넌트 추후 props로 list를 받아와야함  -> ReserveContainer에서 작업

const CustomItemList = ({ menuList }) => {
    const itemList = menuList.map((data) => (
        <CustomItem datas={data} key={data.item_id} />
    ));
    return <div className={styles['custom-lists']}>{itemList}</div>;
};

export default CustomItemList;
