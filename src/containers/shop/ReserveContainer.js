import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Paths } from 'paths';
import styles from './Reserve.module.scss';
import cn from 'classnames/bind';

//components
import TitleBar from 'components/titlebar/TitleBar';
import MenuItemList from 'components/item/MenuItemList';
import Message from 'components/message/Message';
import PreferModal from 'components/modal/PreferModal';
import Loading from '../../components/asset/Loading';
import CartLink from '../../components/cart/CartLink';
import TabTests from '../../components/tab/SwiperTabs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ButtonBase } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

//api
import { getPreferMenuList, getMenuList } from '../../api/menu/menu';
import { getCategory } from '../../api/category/category';
import produce from 'immer';

//store
import {
    get_catergory,
    get_menulist,
    add_menuitem,
} from '../../store/product/product';

import {
    get_prefer_list,
    get_general_list,
    set_type,
    set_serach,
    init
} from '../../store/product/prefer';

//hooks
import { useDomScroll, useRestore } from '../../hooks/useScroll';
import { useModal } from '../../hooks/useModal';

const cx = cn.bind(styles);

const OFFSET = 10;
const LIMIT = 10;

const ReserveContainer = ({ menu, modal, query }) => {
    const SWIPER = useRef(null);
    const SWIPER_SLIDE = useRef(null);
    const openModal = useModal();

    const { prefer_items, general_items, type, search } = useSelector(
        (state) => state.prefer,
    );
    const { categorys, items } = useSelector((state) => state.product);
    const { addr1 } = useSelector((state) => state.address);
    const { store } = useSelector((state) => state.store);

    const dispatch = useDispatch();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('추천메뉴');
    const [tabIndex, setTabIndex] = useState(menu);

    const [preferEmpty, setPreferEmpty] = useState(false);
    const [generalEmpty, setGeneralEmpty] = useState(false);

    const { restoreScroll, restoreOffset } = useRestore();
    const { isScrollEnd, onScroll } = useDomScroll(); //스크롤 끝 판단.
    const [isPaging, setIsPaging] = useState(false); //페이징중인지
    const [offset, setOffset] = useState(OFFSET);

    const onOpenModal = () => history.push(Paths.ajoonamu.shop + '/prefer' + query);
    const onCloseModal = () => history.goBack();

    const onChangeType = (type) => dispatch(set_type(type));

    const onChangeTabIndex = useCallback(
        (index) => {
            history.push(`${Paths.ajoonamu.shop}?menu=${index}`);
            SWIPER.current.slideTo(index, 300);
        },
        [history],
    );
    const onChangeSwiperIndex = useCallback(
        (index) => {
            history.push(`${Paths.ajoonamu.shop}?menu=${index}`);
        },
        [history],
    );

    const onClickInit = () => {
        openModal(
            '추천메뉴 설정을 다시하시겠습니까?',
            '재설정을 원하시면 예를 눌러주세요',
            () => {
                dispatch(init());
            },
            () => {},
            true,
        );
    };

    //첫 로딩시 카테고리 받아오기
    const getCategoryList = useCallback(async () => {
        //카테고리 길이가 1이면 받아오기.
        if (categorys.length === 0) {
            try {
                const res = await getCategory();
                dispatch(get_catergory(res));
            } catch (e) {
                console.error(e);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //첫 로딩시 메뉴 받아오기
    const getProductList = useCallback(async () => {
        setLoading(true);
        try {
            // 카테고리별로 메뉴 리스트 받아오기.
            let arr = [];
            if (categorys.length !== 0 && store && !items) {
                for (let i = 0; i < categorys.length; i++) {
                    const { ca_id } = categorys[i];
                    const result = await getMenuList(
                        ca_id,
                        0,
                        LIMIT,
                        store.shop_id,
                    );
                    const temp = {
                        ca_id: ca_id,
                        items: result.data.query.items,
                    };
                    arr.push(temp);
                }
                dispatch(get_menulist(arr));
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [categorys, store, items, dispatch]);

    //오프셋이 바뀌었을때 페이지네이션으로 메뉴를 불러오는 함수.
    const PageNationMenuList = useCallback(async () => {
        if (!loading) {
            try {
                //현재 탭이 추천메뉴 탭이 아니고, 카테고리를 받아오고난뒤, 아이템과 스토어가  있으면 실행
                if (
                    tabIndex !== 0 &&
                    categorys.length !== 0 &&
                    items &&
                    store
                ) {
                    const res = await getMenuList(
                        categorys[tabIndex - 1].ca_id,
                        offset,
                        LIMIT,
                        store.shop_id,
                    );

                    const get_list = res.data.query.items;
                    if (get_list.length !== 0) {
                        setIsPaging(true);
                        setOffset(offset + LIMIT);

                        dispatch(
                            add_menuitem({
                                ca_id: categorys[tabIndex - 1].ca_id,
                                items: get_list,
                            }),
                        );
                    } else {
                    }
                    setTimeout(() => {
                        setIsPaging(false);
                    }, 1000);
                }
            } catch (e) {}
        }
    }, [tabIndex, categorys, offset, items, loading, store, dispatch]);

    //맞춤 주문 설정
    const onClickCustomOrder = async (budget, desireQuan) => {
        onCloseModal();
        setLoading(true);
        try {
            const res = await getPreferMenuList(
                0,
                500,
                0,
                500,
                1,
                budget,
                desireQuan,
                addr1,
                store.shop_id,
            );
            if (res.items_prefer.length !== 0) {
                dispatch(get_prefer_list(res.items_prefer));
                setPreferEmpty(false);
            } else {
                setPreferEmpty(true);
            }
            if (res.items_general.length !== 0) {
                dispatch(get_general_list(res.items_general));
                setGeneralEmpty(false);
            } else {
                setGeneralEmpty(true);
            }
            dispatch(set_serach(true));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

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
                ref={index === tabIndex - 1 ? SWIPER_SLIDE : null}
            >
                {items[index].items.length !== 0 ? (
                    <MenuItemList
                        menuList={items[index].items}
                        onClick={onClickMenuItem}
                    />
                ) : (
                    <Message
                        msg={
                            '배달 가능한 매장이 없거나 메뉴가 존재하지 않습니다.'
                        }
                        src={true}
                        isButton={false}
                    />
                )}
            </SwiperSlide>
        ));
        return item;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categorys, items, onClickMenuItem, offset, SWIPER_SLIDE, tabIndex]);

    //첫 로딩시 카테고리 셋팅
    useEffect(() => {
        getCategoryList();
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 첫 로딩시 메뉴 셋팅
    useEffect(() => {
        if (!isPaging) {
            getProductList();
        }
    }, [getProductList, isPaging]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //로딩 완료 되었을 때 스크롤 위치로 이동.
    useEffect(() => {
        setTimeout(() => {
            restoreScroll(SWIPER_SLIDE.current);
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (categorys.length !== 0) {
            if (tabIndex === 0) {
                setTitle('추천메뉴');
            } else {
                const title = categorys[tabIndex - 1].ca_name;
                setTitle(title);
            }
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
                    {store ? (
                        <>
                            {categorys.length !== 0 && (
                                <TabTests
                                    idx={tabIndex}
                                    onChange={onChangeTabIndex}
                                    categorys={produce(categorys, (draft) => {
                                        draft.unshift({
                                            ca_name: '추천메뉴',
                                        });
                                    })}
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
                                    onSwiper={(swiper) =>
                                        (SWIPER.current = swiper)
                                    }
                                >
                                    <SwiperSlide
                                        className={styles['swiper-slide']}
                                        onScroll={onScroll}
                                        ref={
                                            tabIndex === 0 ? SWIPER_SLIDE : null
                                        }
                                    >
                                        <PreferMenu
                                            empty={
                                                type === 0
                                                    ? preferEmpty
                                                    : generalEmpty
                                            }
                                            list={
                                                type === 0
                                                    ? prefer_items
                                                    : general_items
                                            }
                                            type={type}
                                            search={search}
                                            onClick={onClickMenuItem}
                                            handleOpen={onOpenModal}
                                            onChange={onChangeType}
                                            init={onClickInit}
                                        />
                                    </SwiperSlide>
                                    {items && renderSwiperItem()}
                                </Swiper>
                            </div>
                            <PreferModal
                                open={modal === 'prefer'}
                                handleClose={onCloseModal}
                                onCustomOrder={onClickCustomOrder}
                            />
                            <CartLink />
                        </>
                    ) : (
                        <div className={styles['msg']}>
                            <Message
                                msg={'주소지가 설정되지 않았습니다.'}
                                src={true}
                                isButton={true}
                                buttonName={'주소지 설정하기'}
                                onClick={() =>
                                    history.push(Paths.ajoonamu.address)
                                }
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

function PreferMenu({
    empty,
    search,
    list,
    onClick,
    type,
    handleOpen,
    onChange,
    init,
}) {
    return (
        <>
            {!search ? (
                <>
                    <Message
                        msg={`전체 예산과 희망 수량을 선택하시면\n 메뉴 구성을 추천 받으실 수 있습니다.`}
                        isButton={true}
                        onClick={handleOpen}
                        buttonName={'맞춤 주문 하기'}
                    />
                </>
            ) : (
                <>
                    <ul>
                        <li
                            className={cx({ active: type === 0 })}
                            onClick={() => {
                                onChange(0);
                            }}
                        >
                            <ButtonBase>맞춤메뉴</ButtonBase>
                        </li>
                        <li
                            className={cx({ active: type === 1 })}
                            onClick={() => {
                                onChange(1);
                            }}
                        >
                            <ButtonBase>일반메뉴</ButtonBase>
                        </li>
                    </ul>
                    <Refesh onClick={init} />
                    {!empty ? (
                        <>
                            <div className={styles['length']}>
                                총 <b> {list.length}</b>개의 추천메뉴가
                                있습니다.
                            </div>
                            <MenuItemList menuList={list} onClick={onClick} />
                        </>
                    ) : (
                        <Message
                            msg={`추천 드릴 메뉴 구성이 없습니다.`}
                            isButton={true}
                            onClick={handleOpen}
                            buttonName={'맞춤 주문 하기'}
                        />
                    )}
                </>
            )}
        </>
    );
}

function Refesh({ onClick }) {
    return (
        <IconButton className={styles['refesh']} onClick={onClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#999">
                <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z" />
            </svg>
        </IconButton>
    );
}

export default ReserveContainer;
