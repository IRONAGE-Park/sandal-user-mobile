import React, { useState, useCallback, useEffect } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import styles from './Detail.module.scss';
import Button from 'components/button/Button';
import AdditionalList from 'components/item/AdditionalList';
import Counter from 'components/counter/Counter';
import classNames from 'classnames/bind';
import { DBImageFormat, numberFormat, stringNumberToInt } from '../../lib/formatter';
import Loading from '../../components/asset/Loading';
import { getMenuInfo } from '../../api/menu/menu';
import { addCartItem } from '../../api/cart/cart';
import { useStore } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';
import { noAuthAddCart } from '../../api/noAuth/cart';
import ErrorCoverImage from '../../components/asset/ErrorCoverImage';
import Noimage from '../../components/svg/noimage.png';
import TitleBar from '../../components/titlebar/TitleBar';

const cx = classNames.bind(styles);

const DetailContainer = ({ item_id }) => {
    const history = useHistory();

    const openModal = useModal();
    const { addr1, lat, lng } = useSelector((state) => state.address);
    const user_token = useStore(false);
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quanity, setQuanity] = useState(1);
    const [options, setOptions] = useState(null);
    const [option_total, setOptionTotal] = useState(0);
    // const { company } = useSelector(state => state.company);

    // 옵션 아이템 선택
    const setOptionItem = useCallback(() => {
        const add_option = menu.options
            .filter((option) => option.check)
            .map((option) => option.option_id);
        setOptions(add_option);
    }, [menu]);

    const onDecrement = useCallback(() => {
        const q = parseInt(quanity);
        if (q > 1) setQuanity(q - 1);
    }, [quanity]);

    const onIncrement = useCallback(() => {
        setQuanity(parseInt(quanity) + 1);
    }, [quanity]);

    const getMenu = async () => {
        setLoading(true);
        try {
            const res = await getMenuInfo(item_id);
            if (res.item) {
                setMenu(res);
            } else {
                openModal('없거나 삭제된 상품입니다.', '상품 번호를 다시 한 번 확인해 주세요.');
                history.push(Paths.index);
            }
        } catch (e) {}
        setLoading(false);
    };

    const onClickOptionItem = (id) => {
        const newOptionItem = menu.options.map((item) => {
            if (item.option_id === id) {
                item.check = !item.check;
                let option_price = item.option_price;
                let new_total = option_total;
                new_total += (item.check) ? option_price : (option_price)*-1;
                setOptionTotal(new_total);
            }
            return item;
        });
        setMenu(
            {...menu},
            {options : newOptionItem}
         );
    };

    //장바구니 담기
    const onClickCart = useCallback(async () => {
        if (user_token) {
            try {
                const res = await addCartItem(
                    user_token,
                    item_id,
                    options,
                    quanity,
                );
                if (res.data.msg === '성공') {
                    openModal(
                        '장바구니에 담았습니다.',
                        '장바구니로 이동하시겠습니까?',
                        () => {
                            history.push(Paths.ajoonamu.cart);
                        },
                        () => {},
                        true,
                    );
                }
            } catch (e) {
                alert('Error!');
            }
        } else {
            try {
                //주소가 존재할 때
                if (addr1) {
                    try {
                        const res = await noAuthAddCart(
                            item_id,
                            options,
                            quanity,
                            lat,
                            lng,
                        );
                        const noAuthCartId = JSON.parse(
                            localStorage.getItem('noAuthCartId'),
                        );

                        if (res.data.msg === '성공') {
                            //이미 담은 cart_id가 존재할 경우
                            if (noAuthCartId) {
                                //기존 list에서 push
                                noAuthCartId.push(res.data.query);
                                //그리고 다시 저장
                                localStorage.setItem(
                                    'noAuthCartId',
                                    JSON.stringify(noAuthCartId),
                                );
                            } else {
                                // cart_id가 존재하지 않을 경우 배열의 형태로 push
                                localStorage.setItem(
                                    'noAuthCartId',
                                    JSON.stringify([res.data.query]),
                                );
                            }
                            openModal('장바구니에 담았습니다.', '장바구니로 이동하시겠습니까?',
                                () => {
                                    history.push(Paths.ajoonamu.cart);
                                },
                                () => {},
                                true,
                            );
                        }
                    } catch (e) {
                        
                    }
                } else {
                    openModal('배달지 주소가 설정되지 않았습니다.', '배달지 주소를 설정하시려면 예를 눌러주세요',
                        () => {
                            history.push(Paths.ajoonamu.address);
                        },
                        () => {},
                        true,
                    );
                }
            } catch (e) {
                alert('Error!');
            }
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, item_id, options, quanity, user_token, addr1, lat, lng]);

    const onCounterKeyDown = useCallback(e => {
        if (e.key === 'Enter') {
           onClickCart(); 
        }
    }, []);
    
    useEffect(() => {
        if (quanity < 1) {
            setQuanity(1);
        }
    }, [quanity]);
    useEffect(()=>{
        getMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        menu && setOptionItem();
    }, [menu, setOptionItem]);
    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    <TitleBar title={menu && menu.item.item_name} />
                    <div className={styles['container']}>
                        <div className={styles['menu-img']}>
                            <ErrorCoverImage
                                className={styles['img']}
                                src={
                                    menu ? menu.item.item_img !== '[]'
                                        ? DBImageFormat(menu.item.item_img)[0]
                                        : Noimage: Noimage
                                }
                                alt={'메뉴 이미지'}
                            />
                        </div>
                        <div className={styles['detail-view']}>
                            <div className={styles['menu-info']}>
                                <div className={styles['menu-name']}>
                                    {menu && menu.item.item_name}
                                </div>
                                <div className={styles['menu-explan']}>
                                    {menu && menu.item.item_sub}
                                </div>
                                <div className={styles['cost-count']}>
                                    <div className={styles['cost']}>
                                        {menu && numberFormat(menu.item.item_price)}원
                                    </div>
                                    <div className={styles['count']}>
                                        <Counter
                                            value={quanity}
                                            onChange={e => setQuanity(stringNumberToInt(e.target.value))}
                                            onKeyDown={onCounterKeyDown}
                                            onDecrement={onDecrement}
                                            onIncrement={onIncrement}
                                        />
                                    </div>
                                </div>
                            </div>
                            {menu && menu.options && menu.options.length !== 0 &&
                            <>
                                <div className={cx('title')}>추가 선택</div>
                                <div className={styles['menu-info']}>
                                    <div className={styles['item-text']}>
                                        <AdditionalList
                                            itemList={menu && menu.options}
                                            onClickAddItem={onClickOptionItem}
                                        />    
                                    </div>
                                </div>
                            </>}
                            <div className={styles['content']}>
                                <div className={styles['text-area']}>
                                    <h3 className={styles['item_name']}>
                                        {menu && menu.item.item_name}
                                    </h3>
                                    <p className={styles['item_sub']}>
                                        {menu && menu.item.item_sub}
                                    </p>
                                    <p className={styles['item_caution']}>
                                        {menu && menu.item.item_caution}
                                    </p>
                                </div>
                                <div className={styles['image-area']}>
                                    {/* {company && <ErrorCoverImage src={DBImageFormat(company.item_content_top)[0]} alt="상단 랜딩 이미지" />} */}
                                    {menu &&
                                    menu.item &&
                                    menu.item.item_content !== '[]' &&
                                    DBImageFormat(menu.item.item_content).map(image =>
                                    <ErrorCoverImage src={image} alt="상세 이미지" key={image} /> )}
                                    {/* {company && <ErrorCoverImage src={DBImageFormat(company.item_content_bot)[0]} alt="하단 랜딩 이미지" />} */}
                                </div>
                            </div>
                        </div>
                        <Button
                            title={`${quanity}개 담기 (${numberFormat(
                                (menu && menu.item.item_price * quanity) +
                                    option_total * quanity,
                            )}원)`}
                            onClick={onClickCart}
                            toggle={true}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default DetailContainer;
