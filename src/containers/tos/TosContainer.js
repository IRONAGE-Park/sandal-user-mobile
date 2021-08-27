import React, { useState,useRef } from 'react';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import styles from './Tos.module.scss';
import TabMenu from 'components/tab/TabMenu';
import SwipeableViews from 'react-swipeable-views';
import { Swiper, SwiperSlide } from 'swiper/react';

const tabInit = [
    {
        url: `${Paths.ajoonamu.tos}?tab=0`,
        name: '개인정보 취급방침',
    },
    {
        url: `${Paths.ajoonamu.tos}?tab=1`,
        name: '이용약관',
    },
];

const TosConatainer = ({ tab = '0' }) => {
    const SWIPER = useRef(null);
    const [index, setIndex] = useState(parseInt(tab));
    const history = useHistory();
    const {company} = useSelector(state => state.company);

    const onChangeTabIndex = (e, value) => {
        setIndex(value);
        SWIPER.current.slideTo(value, 300);

    };
    const onChangeSwiperIndex = (index) => {
        setIndex(index);
        history.replace(`${Paths.ajoonamu.tos}?tab=${index}`);
    };

    return (
        <>
            <TabMenu tabs={tabInit} index={index} onChange={onChangeTabIndex} />
            <div className={styles['container']}>
                <Swiper
                           className={styles['swiper']}
                           initialSlide={index}
                           slidesPerView={1}
                           onSlideChange={swiper => onChangeSwiperIndex(swiper.activeIndex)}
                           autoHeight={true}
                           onSwiper={(swiper) => SWIPER.current=swiper}
                >
                    <SwiperSlide className={styles['swiper-slide']}>
                    <p dangerouslySetInnerHTML={{ __html: company && company.private_policy_user}} />
                    </SwiperSlide>
                    <SwiperSlide className={styles['swiper-slide']}>
                    <p dangerouslySetInnerHTML={{ __html: company && company.use_terms_user}} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
};

export default TosConatainer;
