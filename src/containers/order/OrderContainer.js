import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

//styles
import classNames from 'classnames/bind';
import styles from './Order.module.scss';

//lib
import $script from 'scriptjs';
import { numberFormat } from '../../lib/formatter';

//componenst
import { ButtonBase } from '@material-ui/core';
import Button from 'components/button/Button';
//modal
import PointModal from '../../components/modal/PointModal';
import CouponModal from '../../components/modal/CouponModal';
import PaymentModal from '../../components/modal/PaymentModal';

//components
import OrderCheck from 'components/svg/order/OrderCheck';
import SquareCheckBox from '../../components/checkbox/SquareCheckBox';
import Loading from '../../components/asset/Loading';
import Back from 'components/svg/header/Back';
import DatePicker from '../../components/asset/DatePicker';

//hooks
import { useModal } from '../../hooks/useModal';
import { useStore } from '../../hooks/useStore';

//lib
import { Paths, PROTOCOL_ENV } from '../../paths';
import { calculateDate } from '../../lib/calculateDate';


//api
import { user_order } from '../../api/order/order';
import { noAuth_order } from '../../api/noAuth/order';
import { noAuthGetCartList } from '../../api/noAuth/cart';
import { getOrderCoupons } from '../../api/coupon/coupon';
import { getCartList } from '../../api/cart/cart';
import { isCellPhoneForm } from '../../lib/formatChecker';
import { requestPostMobileAuth, requestPostMobileAuthCheck } from '../../api/auth/auth';
import Toast from '../../components/message/Toast';
import AuthTimer from '../../components/sign/AuthTimer';

const cx = classNames.bind(styles);

const pay_arr=['페이플 간편결제','계좌이체','만나서 결제','무통장 입금'];
const pay_type = ['card','transfer','meet','bank'];

const initPayment = [
    {
        payment: pay_arr[0],
    },
    {
        payment: pay_arr[1],
    },
    {
        payment: pay_arr[2],
    },
    {
        payment: pay_arr[3],
    },
];
const AUTH_NUMBER_LENGTH = 6;

const OrderContainer = ({ modal }) => {
    // 포인트모달, 결제방식 모달 때 사용할 것.

    const phoneInputRef = useRef(null);
    const authInputRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const { addr1, addr2, lat, lng, post_num } = useSelector(
        (state) => state.address,
    );
    const order_id = useRef(null);
    const history = useHistory();
    const { company } = useSelector(state => state.company);
    const user_token = useStore(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [couponList, setCouponList] = useState([]);
    const [payment, setPayment] = useState(pay_arr[3]);
    const [totalPrice, setTotalPrice] = useState(0); //총 주문금액
    const [toggle, setToggle] = useState(false);
    const [default_cost ,setDefaultCost] =useState(0); //기존 배달비
    const [dlvCost, setDlvCost] = useState(0); // 주문 수량에 따른 배달비
    const [dlvMemo, setDlvMemo] = useState('없음'); //배달메모
    const [dlvMemoCheck, setDlvMemoCheck] = useState(false);
    const [orderMemoCheck, setOrderMemoCheck] = useState(false);
    const [orderMemo, setOrderMemo] = useState('없음'); //주문메모
    const [PCD_PAYER_ID, SET_PCD_PAYER_ID] = useState(null); //간편결제 ID
    const [PCD_PAYER_ID_TRANSFER, SET_PCD_PAYER_ID_TRANSFER] = useState(null); //간편결제 ID

    const [point_price, setPointPrice] = useState(0); //포인트 할인
    const [cp_price, setCpPrice] = useState(0); //쿠폰할인
    const [cp_id, setCpId] = useState(null); //쿠폰 번호
    const [date, setDate] = useState(calculateDate(new Date(), -2, 'DATE'));
    const [hours, setHours] = useState('09');
    const [minite, setMinite] = useState('00');

    const [hp, setHp] = useState('');
    const [authNumber, setAuthNumber] = useState('');
    const [toast, setToast] = useState(false);
    const [success, setSuccess] = useState(false);

    const [sameOrderReceiver, setSameOrderReceiver] = useState(true);
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const [start_timer, setStartTimer] = useState(false);

    const openModal = useModal();

    const onChangeHp = (e) => setHp(e.target.value);
    const onChangeAuth = (e) => setAuthNumber(e.target.value);
    const onClickCompareAuth = useCallback(async () => {
        if (authNumber.length === AUTH_NUMBER_LENGTH) {
            try {
                const res = await requestPostMobileAuthCheck(hp, authNumber);
                if (res.data.msg === '성공!') {
                    openModal('성공적으로 인증되었습니다!', '절차를 계속 진행해 주세요.');
                    setSuccess(true);
                    setStartTimer(false);
                } else {
                    setToast(true);
                    setToastMessage('인증번호가 틀렸습니다!');
                    authInputRef.current.focus();
                    setTimeout(() => {
                        setToast(false);
                    }, 3000);
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            }
            setAuthNumber('');
        }
    }, [authNumber, hp, openModal, setSuccess]);

    //인증번호 발송 버튼
    const onClickSendAuth = async () => {
        if (isCellPhoneForm(hp)) {
            try {
                const res = await requestPostMobileAuth(hp);
                if (res.data.msg === '실패!') {
                    setToast(true);
                    setToastMessage('SMS not enough point. please charge.');
                    setTimeout(() => {
                        setToast(false);
                    }, 3000);
                } else {
                    setStartTimer(true);
                    openModal('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!', () => authInputRef.current.focus());
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            }
        } else {
            setToast(true);
            setToastMessage('휴대폰 번호 형식에 맞지 않습니다!');
            phoneInputRef.current.focus();
            setTimeout(() => {
                setToast(false);
            }, 3000);
        }
    };
    const onClickReSendAuth = () => {
        openModal('인증번호를 재전송 하시겠습니까?', '인증번호는 6자리입니다.', () => {
            setStartTimer(false);
            onClickSendAuth();
        }, ()=>{}, true);
    };


    const onChangeName = (e) => setName(e.target.value);
    const onChangeDlvCheck = (e) => {
        console.log('배달요청사항', e.target.checked);
        setDlvMemoCheck(e.target.checked);
    }
    const onChangeOrderCheck = (e) => {
        console.log('주문요청사항', e.target.checked)
        setOrderMemoCheck(e.target.checked);
    }
    const onChangeDeleveryMemo = (e) => setDlvMemo(e.target.value);
    const onChangeOrderMemo = (e) => setOrderMemo(e.target.value);

    const onOpenModalPoint = () => history.push(Paths.ajoonamu.order + '/point');
    const onOpenModalCoupon = () => history.push(Paths.ajoonamu.order + '/coupon');
    const onOpenModalPayment = () => history.push(Paths.ajoonamu.order + '/payment');
    const onCloseModal = () => history.goBack();

    const onClickToggle = () => setToggle(!toggle);

    const onClickPayment = (payment) => {
        setPayment(payment);
        onCloseModal();
        sessionStorage.setItem('payment', payment);
    };
    const onClickCouponSelect = (cp_price, cp_id, cp_list) => {
        setCpPrice(cp_price);
        setCpId(cp_id);
        setCouponList(cp_list);
    };

    const getUserCoupons = async () => {
        if (user_token) {
            try {
                const res = await getOrderCoupons(user_token);
                setCouponList(res);
            } catch (e) {
                console.error(e);
            }
        }
    };

    //총 주문금액 구하기 (장바구니 조회해서 가져옴);
    const getTotalPrice = useCallback(async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getCartList(user_token);
                if (res.data.msg === 'success') {
                    let price = 0;
                    const { query } = res.data;
                    let len = Object.keys(query).length;
                    for (let i = 0; i < len - 3; i++) {
                        const { item, options } = query[i];

                        price +=
                            parseInt(item.item_price) *
                            parseInt(item.item_quanity);

                        for (let j = 0; j < options.length; j++) {
                            const { option_price } = options[j];
                            price +=
                                parseInt(option_price) *
                                parseInt(item.item_quanity);
                        }
                    }

                    if (query.PCD_PAYER_ID === null) {
                        SET_PCD_PAYER_ID(query.PCD_PAYER_ID);
                    } 
                    else {
                        SET_PCD_PAYER_ID(query.PCD_PAYER_ID.pp_tno);
                    }

                    if (query.PCD_PAYER_ID_transfer === null) {
                        SET_PCD_PAYER_ID_TRANSFER(query.PCD_PAYER_ID_transfer);
                    } 
                    else {
                        SET_PCD_PAYER_ID_TRANSFER(query.PCD_PAYER_ID_transfer.pp_tno);
                    }
                    if (price === 0) {
                        history.replace(Paths.index);
                        openModal('잘못된 접근입니다.');
                    }
                    setTotalPrice(price);
                    setDefaultCost(query.delivery_cost);
                }
            } catch (e) {}
        } else {
            try {
                if (addr1) {
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
                    let price = 0;

                    for (let i = 0; i < len - 1; i++) {
                        const { item, options } = query[i];
                        price +=
                            parseInt(item.item_price) *
                            parseInt(item.item_quanity);

                        for (let j = 0; j < options.length; j++) {
                            const { option_price } = options[j];
                            price +=
                                parseInt(option_price) *
                                parseInt(item.item_quanity);
                        }
                    }
                    if (price === 0) {
                        history.replace(Paths.index);
                        openModal('잘못된 접근입니다.');
                    } 
                    setDefaultCost(query.delivery_cost);
                    setTotalPrice(price);
                }
            } catch (e) {}
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_token, addr1]);

    const getPayment = () => {
        const payment_item = sessionStorage.getItem('payment');
        if (payment_item) {
            setPayment(payment_item);
        }
    };
    const getPaymentType =(payment)=>{
        switch (payment) {
            case pay_arr[0]:
                return pay_type[0];
            case pay_arr[1]:
                return pay_type[1];
            case pay_arr[2]:
                return pay_type[2];
            case pay_arr[3]:
                return pay_type[3];
                default :
                return pay_type[0];
        }
    }

    const onClickOrder = async () => {
        const payple_url = 'https://cpay.payple.kr/js/cpay.payple.1.0.1.js';

        const year = date.getFullYear();
        const month = date.getMonth()+1 > 9 ? date.getMonth()+1 : `0${date.getMonth()+1}`;
        const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
        const delivery_req_time = `${year}-${month}-${day} ${hours}:${minite}:00`;
        const settle_case = getPaymentType(payment);
        let res =null;
        //회원 주문
        if (user_token) {
            res = await user_order(
                user_token,
                'reserve',
                orderMemo,
                dlvMemo,
                delivery_req_time,
                cp_id,
                point_price,
                settle_case,
                name, hp,
                receiverName, receiverPhone
            );
            order_id.current = res.data.query;
        }
        //비회원 주문
        else {
            const cart_ids = JSON.parse(localStorage.getItem('noAuthCartId'));
            res = await noAuth_order(
                cart_ids,
                name,
                hp,
                post_num,
                addr1,
                addr2,
                lat,
                lng,
                'reserve',
                orderMemo,
                dlvMemo,
                delivery_req_time,
                settle_case,
                receiverName, receiverPhone
            );
            order_id.current = res.data.query;
        }
        if(res.data.state===1) {
            // ['페이플 간편결제','계좌이체','만나서 결제','무통장 입금']
            //무통장 입금 or 만나서 카드결제
            if(payment===pay_arr[2] || payment===pay_arr[3]){
                setLoading(true);
                setTimeout(()=>{
                    setLoading(false);
                    history.push(Paths.ajoonamu.order_complete +'?order_number='+order_id.current);
                },300)
            }

            //간편 계좌결제 or 간편 카드결제
            else{
            //결제 스크립트
            $script(payple_url, () => {
                /*global PaypleCpayAuthCheck*/
                const getResult = function (res) {
                    alert('callback : ' + res.PCD_PAY_MSG);
                };

                let pay_type = 'card';
                let pay_work = 'CERT'; //결제 타입 1. AUTH 계좌등록 2.CERT 가맹점 최종승인후 계좌등록 + 결제진행 3.PAY 가맹점 승인 없이 계좌등록 + 결제진행
                let payple_payer_id = '';

                let buyer_no = user ? user.id : null; //고객 고유번호
             //   let buyer_name = noAuthName; //고객 이름
             //   let buyer_hp = `${hp}`; //고객 번호
              //  let buyer_email = user && user.email; //고객 이메일
                let buy_goods = '(주)샌달 상품 결제'; //구매하는 물건 이름
                let buy_total = Number(
                    parseInt(totalPrice) +
                        parseInt(dlvCost) -
                        parseInt(cp_price) -
                        parseInt(point_price),
                ); //가격
                let buy_taxtotal = 0;
                let buy_istax = ''; //과세설정 DEFAULT :Y  비과세 N
                let order_num = order_id.current; //주문 번호
                let is_reguler = 'N';
                let is_taxsave = 'N';
                let simple_flag = 'N';
                let card_ver = '01';

                let obj = new Object();

                /*
                * DEFAULT SET 1
                */
                obj.PCD_CPAY_VER = '1.0.1'; // (필수) 결제창 버전 (Default : 1.0.0)
                obj.PCD_PAY_WORK = pay_work; // (필수) 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)
                obj.PCD_SIMPLE_FLAG = 'N'; //간편 결제 여부

                //ID가 있으면 간편결제 시작

                // 카드 간편결제
                if(payment===pay_arr[0]){

                    if (PCD_PAYER_ID !== null) {
                        payple_payer_id = PCD_PAYER_ID;
                        simple_flag = 'Y';
                    }
                    obj.PCD_PAY_TYPE = 'card'; // (필수) 결제 방법 (transfer | card)
                    obj.PCD_CARD_VER = card_ver; // DEFAULT: 01 (01: 정기결제 플렛폼, 02: 일반결제 플렛폼)

                }

                //계좌 간편결제
                else if(payment===pay_arr[1]){
                    
                    if (PCD_PAYER_ID_TRANSFER !== null) {
                        payple_payer_id = PCD_PAYER_ID_TRANSFER;
                        simple_flag = 'Y';
                    }
                    obj.PCD_PAY_TYPE = 'transfer'; // (필수) 결제 방법 (transfer | card)
                }

                if (simple_flag === 'Y' && payple_payer_id !== '') {
                    obj.PCD_SIMPLE_FLAG = 'Y'; // 간편결제 여부 (Y|N)
                    obj.PCD_PAYER_ID = payple_payer_id; // 결제자 고유ID (본인인증 된 결제회원 고유 KEY)
                }
        

                /*
                    DEFAUILT SET 2 결제수단에 따른 값 설정
                */

                //## 2.2 간편결제 (재결제)
                obj.PCD_PAYER_NO = buyer_no; // (선택) 가맹점 회원 고유번호 (결과전송 시 입력값 그대로 RETURN)
                obj.PCD_PAY_GOODS = buy_goods; // (필수) 결제 상품
                obj.PCD_PAY_TOTAL = buy_total; // (필수) 결제 금액
                obj.PCD_PAY_TAXTOTAL = buy_taxtotal; // (선택) 부가세(복합과세인 경우 필수)
                obj.PCD_PAY_ISTAX = buy_istax; // (선택) 과세여부 (과세: Y | 비과세(면세): N)
                obj.PCD_PAY_OID = order_num; // 주문번호 (미입력 시 임의 생성)
                obj.PCD_REGULER_FLAG = is_reguler; // (선택) 정기결제 여부 (Y|N)
                obj.PCD_TAXSAVE_FLAG = is_taxsave; // (선택) 현금영수증 발행 여부 (Y|N)
                /*
                * DEFAULT SET 3
                */

               obj.PCD_PAYER_AUTHTYPE = 'pwd'; // (선택) [간편결제/정기결제] 본인인증 방식
                obj.PCD_RST_URL =
                    PROTOCOL_ENV + 'api.ajoonamu.com/api/user/payple/order_mobile'; // (필수) 결제(요청)결과 RETURN URL
                obj.payple_auth_file =
                    PROTOCOL_ENV + 'api.ajoonamu.com/api/user/payple/auth'; // (필수) 가맹점이 직접 생성한 인증파일
                obj.callbackFunction = getResult;

                PaypleCpayAuthCheck(obj);
            });
            }
       }
      else if(res.data.state===2){
          openModal(res.data.msg);
      }
      else{
         openModal('잘못된 접근입니다');
      }
    };
    useEffect(() => {
        if (company && totalPrice) {
            if (company.minimum_order > totalPrice) {
                history.replace(Paths.index);
                openModal('잘못된 접근입니다.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company, totalPrice])

    useEffect(() => {
        window.scrollTo(0, 0);
        getUserCoupons();
        getPayment();
        const memo = JSON.parse(localStorage.getItem('requestMemo'));
        if (memo) {
            if (memo.dlvMemo !== false) {
                setDlvMemoCheck(true);
                setDlvMemo(memo.dlvMemo);
            }
            if (memo.orderMemo !== false) {
                setOrderMemoCheck(true);
                setOrderMemo(memo.orderMemo);
            }
        }
    }, []);

    useEffect(() => {
        getTotalPrice();
    }, [getTotalPrice]);
    useEffect(() => {
        localStorage.setItem(
            'requestMemo',
            JSON.stringify({
                dlvMemo: dlvMemoCheck && dlvMemo,
                orderMemo: orderMemoCheck && orderMemo,
            }),
        );
    }, [dlvMemoCheck, orderMemoCheck, dlvMemo, orderMemo]);

        
    useEffect(()=>{
        if (company) {
            const cost = (totalPrice >= company.free_cost_order) ? 0 : default_cost;
            setDlvCost(cost);
        }
    }, [totalPrice, default_cost, company]);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user])

    useEffect(() => {
        if (sameOrderReceiver) {
            setReceiverName(name);
            setReceiverPhone(hp);
        }
    }, [sameOrderReceiver, name, hp]);
    

    return (
        <>
            <Loading open={loading} />
            <div className={styles['order']}>
                <div className={cx('title', 'pd-box')}>배달정보</div>
                <div className={styles['table']}>
                    <div className={cx('text-info')}>
                        <div className={cx('info', 'row')}>
                            <input
                                type="text"
                                value={name}
                                onChange={onChangeName}
                                className={cx('input', 'normal')}
                                placeholder="주문 하시는 분의 이름을 입력하세요."
                            />
                        </div>
                    </div>
                    <div className={cx('text-info', 'address')}>
                        <div className={styles['info']}>{addr1}</div>
                        <div style={{ color: '#555', fontSize: '14px', marginTop: '8px' }} className={styles['info']} >
                            {addr2}
                        </div>
                    </div>

                    <div className={cx('text-info')}>
                        <div className={cx('info', 'row')}>
                            <input
                                type="tel"
                                placeholder="휴대폰 번호"
                                value={hp}
                                onChange={onChangeHp}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        if (start_timer) {
                                            onClickReSendAuth();
                                        } else {
                                            onClickSendAuth();
                                        }
                                    }
                                }}
                                ref={phoneInputRef}
                                disabled={success}
                                className={cx('input', 'auth')}
                            />
                            <ButtonBase
                                onClick={start_timer ? onClickReSendAuth : onClickSendAuth}
                                disabled={success}
                                className={styles['auth-btn']}>
                                {success ? "인증 완료" : start_timer ? "인증번호 재발송" : "인증번호 발송" }
                            </ButtonBase>
                        </div>
                    </div>
                    <div className={cx('text-info', 'auth-area', { auth_open: start_timer })}>
                        <div className={cx('info', 'row')}>
                            <input
                                type="number"
                                placeholder="인증번호"
                                onChange={onChangeAuth}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        onClickCompareAuth();
                                    }
                                }}
                                ref={authInputRef}
                                disabled={!start_timer}
                                value={authNumber}
                                className={cx('input', 'auth')}
                            />
                            <div className={styles['timer']}>
                                <AuthTimer start={start_timer} setStart={setStartTimer} />
                            </div>
                            <ButtonBase
                                disabled={!start_timer}
                                onClick={onClickCompareAuth}
                                className={styles['auth-btn']}>
                                인증하기
                            </ButtonBase>
                        </div>
                    </div>
                    <Toast on={toast} msg={toastMessage} />
                </div>
                
                <div className={cx('title', 'pd-box')}>수령인 정보</div>
                <div className={styles['table']}>
                    <div className={styles['receiver-box']}>
                        <SquareCheckBox
                            id={'order'}
                            text={'주문자와 동일'}
                            check={sameOrderReceiver}
                            onChange={() => setSameOrderReceiver(!sameOrderReceiver)}
                        />
                    </div>
                    <div className={cx('text-info')}>
                        <div className={cx('info', 'row')}>
                            <input
                                type="text"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                className={cx('input', 'normal')}
                                placeholder="배달 받으실 분의 이름을 입력하세요."
                                readOnly={sameOrderReceiver}
                            />
                        </div>
                    </div>
                    <div className={cx('text-info')}>
                        <div className={cx('info', 'row')}>
                            <input
                                type="tel"
                                placeholder="휴대폰 번호"
                                value={receiverPhone}
                                onChange={e => setReceiverPhone(e.target.value)}
                                readOnly={sameOrderReceiver}
                                className={cx('input', 'auth')}
                            />
                        </div>
                    </div>
                    <Toast on={toast} msg={toastMessage} />
                </div>
                <div className={cx('title', 'pd-box')}>배달 요청 시간</div>
                <div className={cx('date-picker', 'pd-box')}>
                    <div className={styles['date']}>
                        <DatePicker
                         minDate={ calculateDate(new Date(), -2, 'DATE')}
                         date={date} 
                         setDate={setDate} 
                         />
                    </div>
                    <div className={styles['time']}>
                        <div className={styles['second']}>
                            <select
                                name="hours"
                                onChange={e => setHours(e.target.value)}
                            >
                                {[...new Array(24).keys()]
                                    .map((item) => (
                                        <option value={item} key={item}>
                                            {(item >= 12 ? '오후 ' : '오전 ') +
                                                (item > 12 ? item - 12 : item) +
                                                '시'}
                                        </option>
                                    ))}3
                            </select>
                        </div>

                        <div className={styles['second']}>
                            <select
                                name="minute"
                                onChange={e => setMinite(e.target.value)}
                            >
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={cx('title', 'pd-box')}>요청사항</div>
                <div className={cx('table', 'pd-box')}>
                    <div className={styles['input-save']}>
                        <div className={styles['input-title']}>
                            주문 요청사항
                        </div>
                        <div className={styles['save']}>
                            <SquareCheckBox
                                id={'od'}
                                text={'자동저장'}
                                check={orderMemoCheck}
                                onChange={onChangeOrderCheck}
                            />
                        </div>
                    </div>
                    <div className={cx('value', 'mg-bot')}>
                        <input
                            type="text"
                            className={styles['input']}
                            value={dlvMemo}
                            onChange={onChangeDeleveryMemo}
                        ></input>
                    </div>
                    <div className={styles['input-save']}>
                        <div className={styles['input-title']}>
                            배달 요청사항
                        </div>
                        <div className={styles['save']}>
                            <SquareCheckBox
                                id={'dlv'}
                                text={'자동저장'}
                                check={dlvMemoCheck}
                                onChange={onChangeDlvCheck}
                            />
                        </div>
                    </div>
                    <div className={styles['value']}>
                        <input
                            type="text"
                            className={styles['input']}
                            value={orderMemo}
                            onChange={onChangeOrderMemo}
                        ></input>
                    </div>
                </div>
                <div className={cx('title', 'pd-box')}>결제방법</div>
                <div className={cx('table', 'mg-none')}>
                    <div className={cx('value', 'pd-none')}>
                        <ButtonBase
                            className={styles['payment']}
                            onClick={onOpenModalPayment}
                        >
                            {payment}
                        </ButtonBase>
                        <div className={styles['label']}>
                            다른결제를 원하시면 눌러서 변경해주세요.
                        </div>
                    </div>
                </div>
                {user_token && (
                    <div className={styles['order-info']}>
                        <ButtonBase className={cx('box', 'pd-box')}>
                            <div
                                className={cx('box', 'pd-box')}
                                onClick={onOpenModalCoupon}
                            >
                                <div className={styles['label']}>할인 쿠폰</div>
                                <div className={styles['info']}>
                                    {couponList.length}개 보유
                                    <Back
                                        rotate="180deg"
                                        strokeWidth={1.5}
                                        stroke={'#707070'}
                                        width={18}
                                        height={18}
                                    />
                                </div>
                            </div>
                        </ButtonBase>
                        <ButtonBase className={cx('box', 'pd-box')}>
                            <div
                                className={cx('box', 'pd-box')}
                                onClick={onOpenModalPoint}
                            >
                                <div className={styles['label']}>
                                    포인트 사용
                                </div>
                                <div className={styles['info']}>
                                    {numberFormat(point_price)}원
                                    <Back
                                        rotate="180deg"
                                        strokeWidth={1.5}
                                        stroke={'#707070'}
                                        width={18}
                                        height={18}
                                    />
                                </div>
                            </div>
                        </ButtonBase>
                    </div>
                )}

                <div className={cx('table', 'pd-box', 'bg-color', 'pd-top')}>
                    <div className={cx('total-order')}>
                        <div className={cx('item')}>
                            <div className={cx('text-cost', 'title')}>
                                <div className={cx('pd-box', 'text-cost')}>
                                    <div className={cx('text')}>
                                        총 결제금액
                                    </div>
                                    <div className={cx('cost')}>
                                        {numberFormat(
                                            parseInt(totalPrice) +
                                                parseInt(dlvCost) -parseInt(point_price) - parseInt(cp_price),
                                        )}
                                        원
                                    </div>
                                </div>
                            </div>
                            <div className={styles['total-table']}>
                                <div className={cx('text-cost', 'info')}>
                                    <div className={cx('pd-in', 'text-cost')}>
                                        <div className={cx('text')}>
                                            주문 금액
                                        </div>
                                        <div className={cx('cost')}>
                                            {numberFormat(totalPrice)}원
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('text-cost', 'info')}>
                                    <div className={cx('pd-in', 'text-cost')}>
                                        <div className={cx('text')}>
                                            배달비용
                                        </div>
                                        <div className={cx('cost')}>
                                            {numberFormat(dlvCost)}원
                                        </div>
                                    </div>
                                </div>
                                {user_token && (
                                    <>
                                        <div
                                            className={cx('text-cost', 'info')}
                                        >
                                            <div
                                                className={cx(
                                                    'pd-in',
                                                    'text-cost',
                                                )}
                                            >
                                                <div className={cx('text')}>
                                                    쿠폰 할인
                                                </div>
                                                <div className={cx('cost')}>
                                                    -{numberFormat(cp_price)}원
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={cx('text-cost', 'info')}
                                        >
                                            <div
                                                className={cx(
                                                    'pd-in',
                                                    'text-cost',
                                                )}
                                            >
                                                <div className={cx('text')}>
                                                    포인트 할인
                                                </div>
                                                <div className={cx('cost')}>
                                                    -{numberFormat(point_price)}
                                                    원
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={cx('agree-order')} onClick={onClickToggle}>
                        <OrderCheck check={toggle} />
                        <div className={styles['text']}>
                            구매에 동의하시겠습니까?
                        </div>
                    </div>
                </div>
            </div>
            <Button
                title={`${numberFormat(
                    parseInt(totalPrice) +
                        parseInt(dlvCost) -
                        parseInt(point_price) -
                        parseInt(cp_price),
                )}원 결제`}
                toggle={(user || name.length !== 0) && toggle && success}
                onClick={onClickOrder}
            />
            <PointModal
                open={modal === 'point'}
                handleClose={onCloseModal}
                total_price = { parseInt(totalPrice)+ parseInt(dlvCost)-parseInt(cp_price)}
                user_point={user && user.point}
                onChange={setPointPrice}
                point_price={point_price}
            />
            <CouponModal
                item_price ={totalPrice}
                open={modal === 'coupon'}
                total_price = { parseInt(totalPrice)+ parseInt(dlvCost)-parseInt(point_price)}
                handleClose={onCloseModal}
                list={couponList}
                onClick={onClickCouponSelect}
            />
            <PaymentModal
                open={modal === 'payment'}
                handleClose={onCloseModal}
                payments={initPayment}
                payment={payment}
                onClick={onClickPayment}
            />
            {/* <script src="https://testcpay.payple.kr/js/cpay.payple.1.0.1.js"></script> */}
            {/* <script src="https://cpay.payple.kr/js/cpay.payple.1.0.1.js"></script> */}
        </>
    );
};

export default OrderContainer;
