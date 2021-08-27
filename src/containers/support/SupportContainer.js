import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './SupportContainer.module.scss';
import classNames from 'classnames/bind';

import TabMenu from '../../components/tab/TabMenu';

import { Paths } from '../../paths';

import { requestNoticeList } from '../../api/support/notice';
import { requestFAQList } from '../../api/support/faq';
import PostList from '../../components/support/PostList';
import { Button } from '@material-ui/core';
import Loading from '../../components/asset/Loading';

import { Swiper, SwiperSlide } from 'swiper/react';

const cn = classNames.bind(styles);

const tabInit = [
    {
        url: `${Paths.ajoonamu.support}/notice`,
        name: '공지사항',
    },
    {
        url: `${Paths.ajoonamu.support}/faq`,
        name: '자주 묻는 질문',
    },
];

const faqTypeList = [
    '회원가입',
    '쿠폰',
    '결제',
    '포인트',
    '배달',
    '문구 서비스',
];

const SupportContainer = ({ tab = 'notice' }) => {
    const SWIPER = useRef(null);
    const history = useHistory();
    const [index, setIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    const [faqList, setFAQList] = useState([]);
    const [faqType, setFAQType] = useState('0');
    const emptyMessage =
        tab === 'notice'
            ? '공지사항이 존재하지 않습니다.'
            : '등록된 자주 묻는 질문이 없습니다.';

    const onChangeTabIndex = (e, value) => {
        setIndex(value);
        SWIPER.current.slideTo(value, 300);
    };
    const onChangeSwiperIndex = (index) => {
        setIndex(index);
        const tab = index === 0 ? 'notice' : 'faq';
        history.replace(`${Paths.ajoonamu.support}/${tab}`);
    };

    const getNoticeList = useCallback(async () => {
        /*
            공지사항 불러오기
        */
        setLoading(true);
        try {
            const res = await requestNoticeList(0, 1000);
            const { notices } = res;
            setNoticeList(notices);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, []);

    const getFAQList = useCallback(async (faq_type) => {
        /*
            자주 묻는 질문 불러오기.
            faq_type에 따라 다른 리스트 불러옴
        */
        try {
            setLoading(true);
            const res = await requestFAQList(faq_type);
            setFAQList(res);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        getNoticeList();
    }, [getNoticeList]);

    useEffect(() => {
        getFAQList(faqType);
    }, [getFAQList, faqType]);

    useEffect(() => {
        if (tab !== 'notice') {
            setIndex(1);
        }
        else{
            setIndex(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  

    return (
        <>
        {index !==null && 
        <>
            <TabMenu tabs={tabInit} index={index} onChange={onChangeTabIndex} />
            <div className={styles['container']}>
                    <Swiper
                        className={styles['swiper']}
                        initialSlide={index}
                        slidesPerView={1}
                        onSlideChange={(swiper) => {
                            onChangeSwiperIndex(swiper.activeIndex);
                        }}
                        autoHeight={true}
                        onSwiper={(swiper) => (SWIPER.current = swiper)}
                    >
                        <SwiperSlide className={styles['swiper-slide']}>
                            {!loading && (
                                <PostList
                                    listData={noticeList}
                                    emptyMessage={emptyMessage}
                                />
                            )}
                        </SwiperSlide>
                        <SwiperSlide className={styles['swiper-slide']}>
                            <div className={styles['title']}>
                                <h2 className={styles['text']}>
                                    자주 묻는 질문
                                </h2>
                            </div>

                            <div className={styles['select-area']}>
                                <Button>
                                    <select
                                        className={cn('input-box')}
                                        value={faqType}
                                        onChange={(e) =>
                                            setFAQType(e.target.value)
                                        }
                                    >
                                        <option value="0">회원가입</option>
                                        <option value="1">쿠폰</option>
                                        <option value="2">결제</option>
                                        <option value="3">포인트</option>
                                        <option value="4">배달</option>
                                        <option value="5">문구 서비스</option>
                                    </select>
                                </Button>
                            </div>
                            <div className={styles['title']}>
                                <h2 className={styles['text']}>
                                    {faqTypeList[faqType]}
                                </h2>
                            </div>
                            {!loading && (
                                <PostList
                                    listData={faqList}
                                    emptyMessage={emptyMessage}
                                />
                            )}
                        </SwiperSlide>
                    </Swiper>
            </div>

        </>
        }
    
    
            <Loading open={loading} />
        </>
    );
};

export default SupportContainer;
