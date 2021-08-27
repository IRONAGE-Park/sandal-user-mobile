import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';

import { Swiper, SwiperSlide } from 'swiper/react';
import Message from '../../components/message/Message';
import Title from 'components/titlebar/Title';
import styles from './HomeContainer.module.scss';
import BestMenuItemList from 'components/item/BestMenuItemList';
import MainEventSlide from './HomeEventContainer';
import TabMenu from '../../components/tab/TabMenu';
import BannerImg from 'components/svg/banner/lineBanner.png';
import Loading from 'components/asset/Loading';
import { ButtonBase } from '@material-ui/core';
import cn from 'classnames/bind';
//api
import { getMainMenuList } from '../../api/menu/menu';
import { getMainCategory } from '../../api/category/category';
import {
    getBreakCategory,
    getBreakMenu,
} from '../../api/break_fast/break_fast';

//store
import {
    post_index as onChangeBestIndex,
    get_best_cate,
    get_best_menu,
    add_best_menu,
} from '../../store/product/bestmenu';


import {
    post_index as onChangeBreakIndex,
    get_break_category,
    get_break_menuList,
    add_break_menuitem,
} from '../../store/product/breakfast';

//hooks
import { useDomScroll, useRestore } from '../../hooks/useScroll';
import ReviewListView from '../../components/review/ReviewListView';
import { requestGetReviewList } from '../../api/review/review';
import ReviewModal from '../../components/modal/ReviewModal';

const cx = cn.bind(styles);
const OFFSET = 8;
const LIMIT = 100;

const tabInit = [
    {
        // url: `${Paths.ajoonamu.shop}?menu=0`,
        name: '예약주문',
    },
    {
        // url: '/',
        // url: `${Paths.ajoonamu.shop}?menu=1`,
        name: '정기배송',
    },
];

const HomeContainer = ({ review_id }) => {
    // useScroll();
    const history = useHistory();
    const SWIPER = useRef(null);
    const SUB_TAB = useRef(null);
    const SWIPER_SLIDE = useRef(null);
    const [index, setIndex] = useState(null);

    const {
        items: best_menu,
        categorys: best_cate,
        index: best_post_index,
    } = useSelector((state) => state.bestmenu);
    const {
        items: break_menu,
        categorys: break_cate,
        index: break_post_index,
    } = useSelector((state) => state.breakfast);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { restoreScroll, restoreOffset } = useRestore();
    const { isScrollEnd, onScroll } = useDomScroll(); //스크롤 끝 판단.
    const [isPaging, setIsPaging] = useState(false); //페이징중인지
    const [offset, setOffset] = useState(OFFSET);
    const [reviewList, setReviewList] = useState([]);

    const onChangePostIndex = useCallback(
        (value) => {
            if (index === 0) {
                dispatch(onChangeBestIndex(value));
            }
            else if (index === 1) {
                dispatch(onChangeBreakIndex(value));
            }
        },
        [index],
    );

    const onChangeTabIndex = (e, value) => {
        SWIPER_SLIDE.current.scrollTo(0, 0);
        SWIPER.current.slideTo(value, 300);
        setIndex(value);
    };
    const onChangeSwiperIndex = (index) => {
        setIndex(index);
    };

    //첫 로딩시 카테고리 받아오기
    const callCategoryList = useCallback(async () => {
        //카테고리 길이가 1이면 받아오기.
        if (best_cate.length === 0) {
            try {
                const res = await getMainCategory();
                dispatch(get_best_cate(res));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    //첫 로딩시 베스트 메뉴 받아오기
    const callBestMenuListApi = useCallback(async () => {
        setLoading(true);
        try {
            // 카테고리별로 메뉴 리스트 받아오기.
            let arr = [];
            if (best_cate.length !== 0 && !best_menu) {
                for (let i = 0; i < best_cate.length; i++) {
                    const { ca_id } = best_cate[i];
                    const result = await getMainMenuList(ca_id, 0, LIMIT);
                    const temp = {
                        ca_id: ca_id,
                        items: result.data.query.items,
                    };
                    arr.push(temp);
                }
                dispatch(get_best_menu(arr));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [best_cate, best_menu, dispatch]);

    //첫 로딩시 기업조식 카테고리 받아오기
    const callBreakCategoryApi = useCallback(async () => {
        if (break_cate.length === 0) {
            try {
                const res = await getBreakCategory();
                dispatch(get_break_category(res.data.query.categorys));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    //첫 로딩시 기업조식 메뉴 받아오기
    const callBreakMenuListApi = useCallback(async () => {
        try {
            // 카테고리별로 메뉴 리스트 받아오기.
            let arr = [];
            if (break_cate.length !== 0 && !break_menu) {
                for (let i = 0; i < break_cate.length; i++) {
                    const { ca_id } = break_cate[i];
                    const result = await getBreakMenu(ca_id, 0, LIMIT);
                    const temp = {
                        ca_id: ca_id,
                        items: result.data.query.items,
                    };
                    arr.push(temp);
                }
                dispatch(get_break_menuList(arr));
            }
        } catch (e) {
            console.error(e);
        }
    }, [break_cate, break_menu, dispatch]);

    //오프셋이 바뀌었을때 페이지네이션으로 메뉴를 불러오는 함수.
    const callPageNationMain = useCallback(async () => {
        try {
            const { ca_id } = best_cate[best_post_index];
            const res = await getMainMenuList(ca_id, offset, LIMIT);
            const get_list = res.data.query.items;
            if (get_list.length !== 0) {
                setIsPaging(true);
                setOffset(offset + LIMIT);
                dispatch(
                    add_best_menu({
                        ca_id: ca_id,
                        items: get_list,
                    }),
                );
                setTimeout(() => {
                    setIsPaging(false);
                }, 1000);
            }
        } catch (e) {}
    }, [offset, best_cate, best_post_index, dispatch]);

    const callPageNationBreak = useCallback(async () => {
        try {
            const { ca_id } = break_cate[break_post_index];
            const res = await getBreakMenu(ca_id, offset, LIMIT);
            const get_list = res.data.query.items;
            if (get_list.length !== 0) {
                setIsPaging(true);
                setOffset(offset + LIMIT);
                dispatch(
                    add_break_menuitem({
                        ca_id: ca_id,
                        items: get_list,
                    }),
                );
                setTimeout(() => {
                    setIsPaging(false);
                }, 1000);
            }
        } catch (e) {}
    }, [offset, break_cate, break_post_index, dispatch]);

    const getReviewList = useCallback(async () => {
        try {
            const res = await requestGetReviewList();
            if (res.data.msg === '성공') {
                setReviewList(res.data.query.reviews);
            } else {
                // 실패했을 때
            }
        } catch (e) {
            // 오류났을 때
        }
    }, []);

    useEffect(() => {
        const tab = parseInt(sessionStorage.getItem('home_tab'));
        setIndex(tab ? tab : 0);
    }, []);
    useEffect(() => {
        sessionStorage.setItem('home_tab', index);
    }, [index]);

    useEffect(() => {
        setOffset(OFFSET);
    }, [best_post_index , break_post_index]);

    useEffect(() => {
        callCategoryList();
        callBreakCategoryApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        callBestMenuListApi();
    }, [callBestMenuListApi]);
    useEffect(() => {
        callBreakMenuListApi();
    }, [callBreakMenuListApi]);

    useEffect(() => {
        getReviewList();
    }, [getReviewList]);


    //로딩 완료 되었을 때 스크롤 위치로 이동.
    useEffect(() => {
        setTimeout(() => {
            restoreScroll(SWIPER_SLIDE.current);
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onOpenReview = useCallback(id => {
        history.push(Paths.index + '?review_id=' + id);
    }, [])
    const onCloseReview = useCallback(() => history.goBack(), []);


    // useEffect(() => {
    //     if (isScrollEnd && !isPaging) {
    //         if (index === 0) {
    //             callPageNationMain();
    //         }
    //         else if (index === 1) {
    //             callPageNationBreak();
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isScrollEnd, index]);

    return (
        <>
            <Title />
            {index !== null && (
                <TabMenu
                    tabs={tabInit}
                    index={index}
                    onChange={onChangeTabIndex}
                />
            )}
            <div className={cx('container')}>
                {loading ? (
                    <Loading open={loading} />
                ) : (
                    <>
                        {index !== null && (
                            <Swiper
                                initialSlide={index}
                                ref={SUB_TAB}
                                className={cx('swiper')}
                                initialSlide={index}
                                slidesPerView={1}
                                onSlideChange={(swiper) => {
                                    onChangeSwiperIndex(swiper.activeIndex);
                                }}
                                autoHeight={true}
                                onSwiper={(swiper) => (SWIPER.current = swiper)}
                            >
                                <SwiperSlide
                                    className={styles['swiper-slide']}
                                    ref={index === 0 ? SWIPER_SLIDE : null}
                                    onScroll={onScroll}
                                >
                                    <MainEventContainer />
                                    <HomeLandingMenu
                                        index={index}
                                        categorys={best_cate}
                                        list={best_menu}
                                        post_index={best_post_index}
                                        onChange={onChangePostIndex}
                                        title={'베스트 메뉴'}
                                    />
                                    <ReviewListView reviewList={reviewList} onClick={onOpenReview} />
                                    <ReviewModal open={review_id} review_id={review_id} handleClose={onCloseReview} />
                                </SwiperSlide>

                                <SwiperSlide
                                    className={styles['swiper-slide']}
                                    ref={index === 1 ? SWIPER_SLIDE : null}
                                    onScroll={onScroll}
                                >
                                    <HomeLandingMenu
                                        index={index}
                                        categorys={break_cate}
                                        list={break_menu}
                                        post_index={break_post_index}
                                        onChange={onChangePostIndex}
                                        title={'정기배송'}
                                    />
                                </SwiperSlide>
                            </Swiper>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const HomeLandingMenu = ({
    categorys,
    list,
    post_index,
    onChange,
    title,
}) => {
    let len = categorys.length;
    const view = len < 5 ? len : 5;
    return (
        <>
            {categorys.length !== 0 && (
                <Swiper
                    spaceBetween={15}
                    nested={true}
                    freeMode
                    slidesPerView={1}
                    className={cx('categorys')}
                >
                    <>
                        {categorys.map((c, index) => (
                            <SwiperSlide
                                className={cx('item', {
                                    active: index === post_index,
                                })}
                                key={c.ca_id}
                                onClick={() => onChange(index)}
                            >
                                <ButtonBase>{c.ca_name}</ButtonBase>
                            </SwiperSlide>
                        ))}
                    </>
                </Swiper>
            )}
            <h3 className={cx('menu-list-title')}>
                {title}
            </h3>
            {list && (
                <>
                    {list[post_index].items.length !== 0 ? (
                        <BestMenuItemList menuList={list[post_index].items} />
                    ) : (
                        <Message
                            msg={
                                '배달 가능한 매장이 없거나 메뉴가 존재하지 않습니다.'
                            }
                            src={true}
                            isButton={false}
                        />
                    )}
                </>
            )}
        </>
    );
};

const MainEventContainer = () => {
    const history = useHistory();

    return (
        <>
            <div className={cx('carousel')}>
                <MainEventSlide />
            </div>
            <ButtonBase
                className={cx('banner')}
                onClick={() => {
                    history.push(`${Paths.ajoonamu.shop}?tab=${0}`);
                    window.scrollTo(0, 0);
                }}
            >
                <img src={BannerImg} alt="subBanner" />
            </ButtonBase>
        </>
    );
};

export default HomeContainer;
