import React, { useState, useEffect, useCallback,useRef } from 'react';
//hooks
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useDomScroll ,useRestore} from '../../hooks/useScroll';

//paths
import { Paths } from 'paths';

//styles
import styles from './Breakfast.module.scss';
import TitleBar from 'components/titlebar/TitleBar';
import MenuItemList from 'components/item/MenuItemList';
import Message from 'components/message/Message';
import Loading from '../../components/asset/Loading';
import TabTests from '../../components/tab/SwiperTabs';

import { Swiper, SwiperSlide } from 'swiper/react';

//api
import { getBreakCategory, getBreakMenu } from '../../api/break_fast/break_fast';

//store
import {
    get_break_category,
    get_break_menuList,
    add_break_menuitem,
} from '../../store/product/breakfast';


const OFFSET = 8;
const LIMIT = 8;

const BreakfastContainer = ({ menu }) => {
    const SWIPER = useRef(null);
    const SWIPER_SLIDE = useRef(null);
    const { categorys, items } = useSelector((state) => state.breakfast);

    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [tabIndex, setTabIndex] = useState(menu);

    const {restoreScroll ,restoreOffset} = useRestore();
    const { isScrollEnd, onScroll } = useDomScroll(); //스크롤 끝 판단.
    const [isPaging, setIsPaging] = useState(false); //페이징중인지
    const [offset, setOffset] = useState(8);

    const onChangeTabIndex = useCallback(
        (index) => {
            history.push(`${Paths.ajoonamu.breakfast}?menu=${index}`);
            SWIPER.current.slideTo(index, 300);
        },
        [history],
    );
    const onChangeSwiperIndex = useCallback(
        (index) => {
            history.push(`${Paths.ajoonamu.breakfast}?menu=${index}`);
        },
        [history],
    );

    //첫 로딩시 카테고리 받아오기
    const callBreakCategoryApi = useCallback(async () => {
        if (categorys.length === 0) {
            try {
                const res = await getBreakCategory();
                dispatch(get_break_category(res.data.query.categorys));
            } catch (e) {
                console.error(e);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //첫 로딩시 메뉴 받아오기
    const callBreakMenuListApi = useCallback(async () => {
        setLoading(true);
        try {
            // 카테고리별로 메뉴 리스트 받아오기.
            let arr = [];
            if (categorys.length !== 0 && !items ) {
                for (let i = 0; i < categorys.length; i++) {
                    const { ca_id } = categorys[i];
                    const result = await getBreakMenu(
                        ca_id,
                        0,
                        LIMIT,
                    );
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
        setLoading(false);
    }, [categorys, items,dispatch]);

    //오프셋이 바뀌었을때 페이지네이션으로 메뉴를 불러오는 함수.
    const PageNationMenuList = useCallback(async () => {
        if (!loading) {
            try {
                //현재 탭이 추천메뉴 탭이 아니고, 카테고리를 받아오고난 뒤, 아이템과 스토어가 있으면 실행
                if (
                    categorys.length !== 0 &&
                    items
                ) {
                    const res = await getBreakMenu(
                        categorys[tabIndex].ca_id,
                        offset,
                        LIMIT,
                    );

                    const get_list = res.data.query.items;
                    if (get_list.length !== 0) {
                        setIsPaging(true);
                        setOffset(offset + LIMIT);
                        dispatch(
                            add_break_menuitem({
                                ca_id: categorys[tabIndex].ca_id,
                                items: get_list,
                            }),
                        );
                    }
                    else {}
                    setTimeout(() => {
                        setIsPaging(false);
                    }, 1000);
                }
            } catch (e) {}
        }
    }, [tabIndex, categorys, offset, items, loading, dispatch]);

    const onClickMenuItem = useCallback(
        (item_id) => {
            history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`);
            sessionStorage.setItem('offset', offset);
        },
        [history, offset],
    );

    const renderSwiperItem = useCallback(() => {
            const item = categorys.map((category, index) => (
                <SwiperSlide 
                key={category.ca_id}
                onScroll={onScroll}
                className={styles['swiper-slide']}
                ref={index === tabIndex ? SWIPER_SLIDE : null}
            >
                {items[index].items.length !== 0 ? (
                    <MenuItemList
                        menuList={items[index].items}
                        onClick={onClickMenuItem}
                    />
                ) : (
                    <Message
                        msg={
                            '기업 조식 메뉴가 등록되지 않있습니다.'
                        }
                        src={true}
                        isButton={false}
                    />
                )}
            </SwiperSlide>
        ));
        return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categorys, items, onClickMenuItem, offset]);

    //첫 로딩시 카테고리 셋팅
    useEffect(() => {
        callBreakCategoryApi();
        window.scrollTo(0, 0);
    }, []);

    // 첫 로딩시 메뉴 셋팅
    useEffect(() => {
        if (!isPaging) {
            callBreakMenuListApi();
        }
    }, [callBreakMenuListApi, isPaging]);

    //탭 바뀌었을때 오프셋 갱신
    useEffect(() => {
        setOffset(OFFSET);
    }, [tabIndex]);

    useEffect(() => {
        setTabIndex(menu);
    }, [menu]);


    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            restoreOffset(setOffset);
            setLoading(false);
        }, 100);
    }, []);

    //로딩 완료 되었을 때 스크롤 위치로 이동.
    useEffect(() => {
        setTimeout(() => {
            restoreScroll(SWIPER_SLIDE.current);
        }, 100);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (categorys.length !== 0) {
            const title = categorys[tabIndex].ca_name;
            setTitle(title);
        }
    }, [tabIndex, history, categorys]);
    //스크롤 끝과 페이징중인지 확인후 페이지네이션 실행.
    useEffect(() => {
        if (isScrollEnd && !isPaging) {
            PageNationMenuList();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScrollEnd]);

    return (
        <>
            <TitleBar title={title} isHome={true} />

            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    {categorys.length !== 0 && (
                        <TabTests
                            idx={tabIndex}
                            onChange={onChangeTabIndex}
                            categorys={categorys}
                        />
                    )}
                    <div className={styles['container']}>
                        <Swiper
                            className={styles['swiper']}
                            initialSlide={tabIndex}
                            slidesPerView={1}
                            onSlideChange={(swiper) => {
                                onChangeSwiperIndex(swiper.activeIndex);
                            }}
                            autoHeight={true}
                            onSwiper={(swiper) => (SWIPER.current = swiper)}
                        >
                            {items && renderSwiperItem()}
                        </Swiper>
                    </div>
                </>
            )}
        </>
    );
};
export default BreakfastContainer;
