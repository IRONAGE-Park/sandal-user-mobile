import React, { useState, useCallback, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router';
import { Paths } from 'paths';
import styles from './Cart.module.scss';
import CartItemList from '../../components/cart/CartItemList';
import Button from 'components/button/Button';
import produce from 'immer';
import classNames from 'classnames/bind';
import Check from 'components/svg/sign/Check';

import EstmModal from '../../components/modal/EstmModal';
import Message from 'components/message/Message';
import { numberFormat, stringNumberToInt } from '../../lib/formatter';
import Loading from '../../components/asset/Loading';
import { ButtonBase } from '@material-ui/core';
import {useStore} from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';
import { getCartList, deleteCartItem,updateCartQunaity } from '../../api/cart/cart';
import { noAuthGetCartList, noAuthRemoveCartItem,noAuthUpdateCartQunaity } from '../../api/noAuth/cart';

const cx = classNames.bind(styles);

const CartContainer = ({ modal }) => {

    const history = useHistory();
    const { addr1, lat, lng } = useSelector(state => state.address);
    const { company } = useSelector((state) => state.company);
    const openModal = useModal();

    const [estm, setEstm] = useState(false); //견적서 발송
    const [cartList, setCartList] = useState([]); //장바구니
    const [total, setTotal] = useState(0); //총 주문금액
    const [delivery_cost, setCost] = useState(0); // 주문 수량에 따른 배달비
    const [default_cost ,setDefaultCost] =useState(0); //기존 배달비

    const [loading, setLoading] = useState(false);
    const user_token = useStore(false);

    const handleIncrement = useCallback(index => {
        setCartList(
            produce(cartList, (draft) => {
                draft[index].item.item_quanity++;
            }),
        );
    }, [cartList]);
    const handleDecrement = useCallback(index => {
        setCartList(
            produce(cartList, (draft) => {
                const item_quanity = draft[index].item.item_quanity;
                if (item_quanity > 1) {
                    draft[index].item.item_quanity--;
                }
            }),
        );
    }, [cartList]);

    const handleChange = useCallback((index, value) => {
        setCartList(
            produce(cartList, (draft) => {
                draft[index].item.item_quanity = stringNumberToInt(value);
                if (draft[index].item.item_quanity < 1) {
                    draft[index].item.item_quanity = 1;
                }
            })
        )
    })

    const handleDelete = useCallback(cart_id => {
   
        openModal('상품을 삭제하시겠습니까?', '삭제를 원하시면 예를 눌러주세요.', async () => {
            if (user_token) {
                try {
                    await deleteCartItem(user_token, cart_id);
                }
                catch (e) {
                    openModal('상품을 삭제하는 데에 실패하였습니다!', '잠시 후 다시 시도해 주세요.');
                }
            }
            else {
                try {
                    await noAuthRemoveCartItem(cart_id);
                    const cart_ids = JSON.parse(
                        localStorage.getItem('noAuthCartId'),
                    );
                    const newState = cart_ids.filter(
                        (v) => parseInt(v) !== parseInt(cart_id),
                    );
                    localStorage.setItem(
                        'noAuthCartId',
                        JSON.stringify(newState),
                    );
                    setCartList((list) =>
                        list.filter(
                            ({ item }) =>
                                cart_id.indexOf(item.cart_id) === -1,
                        ),
                    );
                } catch (e) {
                    openModal('상품을 삭제하는 데에 실패하였습니다!', '잠시 후 다시 시도해 주세요.');
                }
            }
            setCartList(list => list.filter(({ item }) => cart_id.indexOf(item.cart_id) === -1))
        }, () => {},true);
    }, [openModal, user_token]);

    const onOpenModal = () => history.push(Paths.ajoonamu.cart + '/estimate');
    const onCloseModal = () => history.goBack();

    const handleOpen = useCallback(() => {
        if (total < company.minimum_order) {
            openModal(
                '최소 주문 금액을 채워주세요.',
                `최소 주문 금액은 ${numberFormat(
                    company.minimum_order,
                )}원입니다.`,
            );
        } else {
            onOpenModal();
        }
    }, [total, company]);

    const onChangeEstm = useCallback(e => setEstm(true), []);
    const onChangeNotEstm = useCallback(e => setEstm(false), []);

    //장바구니 들고오기
    const getCartListApi = useCallback(async () => {
        //유저 정보가 있을때
        if (user_token) {
            setLoading(true);
            try {
                const res = await getCartList(user_token);
                if (res.data.msg === '선택된 배달받을 주소지가 없습니다.') {
                    openModal(res.data.msg, '주소지 설정을 해주세요.', () => {
                    },
                    () => {
                        history.push(Paths.ajoonamu.address) 
                    }
                    );
                } else {
                    const { query } = res.data;
                    let len = Object.keys(query).length;
                    let list = [];
                    for (let i = 0; i < len - 3; i++) {
                        list[i] = query[i];
                        list[i].checked = false;
                    }
                    setDefaultCost(query.delivery_cost);
                    setCartList(list);
                }
            } catch (e) {}
            setLoading(false);
        } else {
            setLoading(true);

            // 로컬스토리지 정보를 정확히 로드하기 위해 0.5초뒤 시작.
            setTimeout(async () => {
                setLoading(true);
                if (addr1) {
                    try {
                        const cart_id = JSON.parse(
                            localStorage.getItem('noAuthCartId'),
                        );
                        const res = await noAuthGetCartList(
                            cart_id,
                            lat,
                            lng,
                            addr1,
                        );
                        const { query } = res.data;
                        let len = Object.keys(query).length;
                        let list = [];
                        for (let i = 0; i < len - 1; i++) {
                            list[i] = query[i];
                            list[i].checked = false;
                        }
                        setDefaultCost(query.delivery_cost);
                        setCartList(list);
                    } catch (e) {}
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }, 500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, addr1, lat, lng, history]);

    const onChangeTotalPrice = useCallback(() => {

        let total = cartList.reduce((prev, { item }) => {
            const { item_price, item_quanity } = item;
            return prev + (item_price * item_quanity);
        }, 0);

        for (let i = 0; i < cartList.length; i++) {
            const { options, item } = cartList[i];
            for (let j = 0; j < options.length; j++) {
                const { option_price } = options[j];
                total += option_price * item.item_quanity;
            }
        }
        setTotal(total);

    }, [cartList]);


    const handleCheckChild = useCallback(e => {
        const index = e.target.id;
        setCartList(
            produce(cartList, (draft) => {
                draft[index].isChecked = !draft[index].isChecked;
            }),
        );
    }, [cartList]);
    
    const onClickOrder = useCallback(async () => {
        setLoading(true);

        if (user_token) {
            try {
                for (let i = 0; i < cartList.length; i++) {
                    const { item } = cartList[i];
                    const res = await updateCartQunaity(
                        user_token,
                        item.cart_id,
                        item.item_quanity,
                    );
                }
            } catch (e) {}
        } else {
            try {
                for (let i = 0; i < cartList.length; i++) {
                    const { item } = cartList[i];
                    await noAuthUpdateCartQunaity(
                        item.cart_id,
                        item.item_quanity,
                    );
                }
            } catch (e) {}
        }
        if (company.minimum_order > total) {
            openModal(
                '최소 주문 금액을 채워주세요.',
                `최소 주문 금액은 ${numberFormat(
                    company.minimum_order,
                )}원입니다.`,
            );
        } else {
            history.push(Paths.ajoonamu.order);
        }
        setLoading(false);
    }, [user_token, cartList, history, total, company]);

    const renderList = useCallback(() => (
            <>
                <div className={styles['bar']}>
                    <ButtonBase className={styles['delete']}
                        onClick={() => handleDelete(cartList.map(({ item }) => item.cart_id))}
                    >전체삭제</ButtonBase>
                </div>
                <div className={styles['cart-list']}>
                    <CartItemList
                        carts={cartList}
                        handleCheckChild={handleCheckChild}
                        handleChange={handleChange}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        handleDelete={handleDelete}
                    />
                </div>
                <div className={styles['finally']}>
                    <div className={styles['pd-box']}>
                        <div className={styles['finally-price']}>
                            <div className={cx('title', 'total')}>
                                총 주문금액
                            </div>
                            <div className={cx('title', 'total')}>
                                {numberFormat(total)}원
                            </div>
                        </div>
                        <div className={styles['finally-price']}>
                            <div className={styles['title']}>배달비</div>
                            <div className={styles['title']}>
                                {numberFormat(delivery_cost)}원
                            </div>
                        </div>
                        <div className={styles['estm']}>
                            <ButtonBase>
                                <div className={cx('check', { on: !estm })} onClick={onChangeNotEstm}>
                                    <div className={styles['check-box']}>
                                        <Check on={!estm} />
                                    </div>
                                    <div className={styles['value']}>견적서 미발송</div>
                                </div>
                            </ButtonBase>
                            <ButtonBase>
                                <div className={cx('check', { on: estm })} onClick={onChangeEstm}>
                                    <div className={styles['check-box']}>
                                        <Check on={estm} />
                                    </div>
                                    <div className={styles['value']}>견적서 발송</div>
                                </div>
                            </ButtonBase>
                        </div>
                    </div>
                </div>
                <Button
                    title={`${numberFormat(parseInt(total)+ parseInt(delivery_cost))}원 주문하기`}
                    onClick={estm ? onOpenModal : onClickOrder}
                    toggle={true}
                ></Button>

                <EstmModal
                    cartList={cartList}
                    open={modal === 'estimate'}
                    dlvCost={delivery_cost}
                    total={total}
                    handleClose={onCloseModal}
                    onClick={onClickOrder}
                />
            </>
        ), [cartList, delivery_cost, estm, handleCheckChild, onCloseModal, handleDecrement, handleDelete, handleIncrement, handleOpen, onChangeEstm, onChangeNotEstm, onClickOrder, modal, total],
    );

        //마운트 될때만 함수 호출.
        useEffect(() => {
            getCartListApi();
        }, [getCartListApi]);
    
        useEffect(onChangeTotalPrice, [onChangeTotalPrice]);

        
    useEffect(()=>{
        if(company){
            const cost = (total>=company.free_cost_order) ? 0 : default_cost;
            setCost(cost);
        }
    },[total,default_cost,company])
    

    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    <div className={styles['container']}>
                        {cartList.length !== 0 ? (
                            renderList()
                        ) : (
                            <Message
                                src={true}
                                msg={'장바구니가 비었습니다.'}
                                isButton={true}
                                buttonName={'주문하러 가기'}
                                onClick={() => {
                                    history.replace(`${Paths.ajoonamu.shop}?menu=1`);
                                }}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default CartContainer;
