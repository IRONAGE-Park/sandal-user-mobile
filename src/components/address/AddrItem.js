import React from 'react';
import styles from './Addr.module.scss';
import { ButtonBase } from '@material-ui/core';

const AddrItem = ({ jibunAddr, roadAddr, onClick }) => {
    const handleClick = () => {
        const data = jibunAddr;
        onClick(data);
    };

    return (
        <ButtonBase className={styles['address-item']} onClick={handleClick}>
            <JibunAddrBox jibunAddr={jibunAddr}></JibunAddrBox>
            <RoadAddrBox roadAddr={roadAddr}></RoadAddrBox>
        </ButtonBase>
    );
};
const JibunAddrBox = ({ jibunAddr }) => {
    return <div className={styles['jibun-box']}>{jibunAddr}</div>;
};
const RoadAddrBox = ({ roadAddr }) => {
    return (
        <div className={styles['roadAddr-box']}>
            <AddrBtn /> {roadAddr}
        </div>
    );
};
const AddrBtn = () => {
    return <div className={styles['btn']}>도로명</div>;
};

export default React.memo(AddrItem);
