import React from 'react';
import styles from './Custom.module.scss';
import Menu from 'components/svg/menu/menu.png';
import { numberFormat } from '../../lib/formatter';

//추천 메뉴 아이템
const CustomItem = ({ datas }) => {
    return (
        <>
            <div className={styles['custom-item']}>
                <CustomImg src={Menu} />
                {/* <CustomTitleList datas={datas}/> */}
                <CustomPrice />
                <div className={styles['dim']} />
            </div>
        </>
    );
};

//추천 메뉴에서 이미지를 렌더할 컴포넌트
function CustomImg({ src }) {
    return (
        <div className={styles['custom-img']}>
            <img src={src} alt={'메뉴'}></img>
        </div>
    );
}

//추천 메뉴리스트에서 이미지를 렌더할 컴포넌트
// function CustomImgList({ datas }) {
//     const list = datas.map(item => (
//         <CustomImg src={logo} />
//     ))
//     return (
//         <div className={styles['custom-img-list']}>
//             {list}
//         </div>
//     )
// }

//추천 메뉴리스트에서 메뉴, 가격 등 텍스트를 렌더할 컴포넌트
function CustomTitleList({ datas }) {
    const list = datas.map((item) => (
        <CustomTitle
            title={item.title}
            count={item.count}
            price={item.price}
            key={item.id}
        />
    ));
    return <div className={styles['custom-title-list']}>{list}</div>;
}

//추천 메뉴에서 메뉴, 가격 등 텍스트를 렌더할 컴포넌트
function CustomTitle({ title, count, price }) {
    return (
        <div className={styles['custom-title']}>
            {`${title} ${count}개 (${numberFormat(price)})`}
        </div>
    );
}

//추천 메뉴에서 수량을 렌더할 컴포넌트
// function CustomCount({ count }) {
//     return (
//         <div className={styles['custom-count']}>
//             {"수량 2개"}
//         </div>
//     )
// }

//추천 메뉴에서 가격을 렌더할 컴포넌트
function CustomPrice({ price }) {
    return <div className={styles['custom-price']}>총 {'20,000원'}</div>;
}

export default React.memo(CustomItem);
