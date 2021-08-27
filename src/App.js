import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './App.css';
import './styles/global.scss';
import { Paths } from 'paths';
import {
    Signin, SignUp, SignupComplete, Recovery, RecoveryId, RecoveryPw, MyPage,
    FindEmail, FindPassword, Home, Account, Address, Reserve, Breakfast,DetailMenu,
    Cart, Order, OrderList, OrderComplete, OrderDetail, Coupon,
    Support, Notice, Event , UpdateName,UpdatePassword,UpdatePhone,ErrorPage,Tos,OAuth
} from 'pages';
import { Route, Switch } from 'react-router-dom';

//components
import ModalContainer from './containers/assets/ModalContainer';
import TitleBar from './components/titlebar/TitleBar';
import BottomNav from './components/nav/BottomNav';

//api
import { noAuthGetNearStore } from './api/noAuth/store';
import { getActiveAddr } from './api/address/address';
import { getNearStore } from './api/store/store';
import { reqNoticeList } from './api/notice';

//hooks
import { useInit } from './hooks/useStore';
import { useUrl } from './hooks/useStore';

//store
import { get_user_info } from './store/auth/auth';
import { get_notice, read_check } from './store/notice/notice';
import { get_company_info } from './store/company';
import OrderReview from './pages/order/OrderReview';


const App = () => {
    useUrl();
    const dispatch = useDispatch();
    const location = useLocation();
    const initStore = useInit();
    const GetInfo = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            dispatch(get_user_info(token));
            const res = await getActiveAddr(token);
            if (res) {
                const { lat, lng, addr1, addr2, post_num } = res;
                const near_store = await getNearStore(token,lat, lng, addr1);
                initStore(
                    addr1,
                    addr2,
                    lat,
                    lng,
                    post_num,
                    near_store.data.query,
                );
            } else {
                initStore();
            }
            GetNotification(token);
        } else {
            const noAuth = JSON.parse(localStorage.getItem('noAuthAddrs'));
            if (noAuth) {
                const index = noAuth.findIndex((item) => item.active === 1);
                if (index !== -1) {
                    const { addr1, addr2, lat, lng, post_num } = noAuth[index];
                    const near_store = await noAuthGetNearStore(
                        lat,
                        lng,
                        addr1,
                    );
                    initStore(
                        addr1,
                        addr2,
                        lat,
                        lng,
                        post_num,
                        near_store.data.query,
                    );
                } else {
                    initStore();
                }
            }
        }
    };

    const GetNotification = async (token) => {
        try {
            const res = await reqNoticeList(token);
            const index = res.notification.findIndex(
                item => !item.not_read_datetime,
            );
            dispatch(read_check(index === -1));
            dispatch(get_notice(res.notification));
        } catch (e) {
            console.error(e);
        }
    };

    const getTitle = useCallback(() => {
        const { pathname } = location;
        if (pathname === '/login') {
            return '로그인';
        } else if (pathname === '/signup') {
            return '회원가입';
        } else if (pathname.indexOf('/complete') !==-1) {
            return '회원가입';
        } else if (pathname === '/recovery') {
            return '내 정보 찾기';
        } else if (pathname === '/recovery_id') {
            return '아이디 찾기';
        } else if (pathname === '/find_email') {
            return '아이디 찾기';
        } else if (pathname === '/recovery_pw') {
            return '비밀번호 찾기';
        } else if (pathname === '/find_password') {
            return '비밀번호 찾기';
        } else if (pathname === '/mypage') {
            return '마이페이지';
        } else if (pathname === '/account') {
            return '내정보';
        } else if (pathname === '/update_name') {
            return '이름 수정';
        } else if (pathname === '/update_phone') {
            return '연락처 수정';
        } else if (pathname === '/update_password') {
            return '비밀번호 수정';
        } else if (pathname === '/address') {
            return '주소 설정';
        } else if (pathname === '/order') {
            return '주문하기';
        } else if (pathname === '/cart') {
            return '장바구니';
        } else if (pathname === '/order_complete') {
            return '주문완료';
        }  else if (pathname === '/order_review') {
            return '리뷰작성';
        } else if (pathname === '/order_detail') {
            return '주문 상세보기';
        } else if (pathname.indexOf('qna') !== -1) {
            return '1:1 문의';
        } else if (pathname.indexOf('support') !== -1) {
            return '고객센터';
        } else if (pathname.indexOf('event') !== -1) {
            return '이벤트';
        } else if (pathname === '/tos') {
            return '이용약관';
        } else if (pathname.indexOf('coupon') !== -1) {
            return '쿠폰';
        }
    }, [location]);


    const bottomNavRender = useCallback(() => {
        const { pathname } = location;
        //샵 추가
        if (pathname === '/') {
            return <BottomNav />;
        } else if (pathname === '/mypage') {
            return <BottomNav />;
        } else if (pathname === '/account') {
            return <BottomNav />;
        } else if (pathname === '/coupon') {
            return <BottomNav />;
        } else if (pathname === '/shop') {
            return <BottomNav />;
        } else if (pathname === '/breakfast') {
            return <BottomNav />;
        } else if (pathname === '/order_list') {
            return <BottomNav />;
        } else if (pathname.indexOf('qna') !== -1) {
            return <BottomNav />;
        } else if (pathname.indexOf('support') !== -1) {
            return <BottomNav />;
        } else if (pathname.indexOf('event') !== -1) {
            return <BottomNav />;
        } else {
            return null;
        }
    }, [location]);

    useEffect(() => {
        sessionStorage.setItem('home_tab', 0);
        GetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        dispatch(get_company_info());
    }, []);


    useEffect(() => {
        getTitle();
    }, [getTitle]);

    // const scrollEvent = useCallback(() => {
    //     const { scrollY } = window;
    //     const offset = preventY - scrollY;
    //     if (offset !== 0) {
    //         if (scrollY > 80 && offset < -10) {
    //             dispatch(scrollOpen('header'));
    //         } else if (scrollY <= 80 || offset >= 30) {
    //             dispatch(scrollClose('header'));
    //         }
    //         preventY = scrollY;
    //     }
    // }, [dispatch]);

    // useEffect(() => {
    //     window.addEventListener('scroll', scrollEvent);
    //     return () => window.removeEventListener('scroll', scrollEvent);
    // }, [scrollEvent]);

    return (
        <div className="App">
            <TitleBar title={getTitle()} />
            <Switch>
                <Route exact={true} path={Paths.index} component={Home} />
                <Route path={Paths.ajoonamu.signin} component={Signin} />
                <Route path={Paths.ajoonamu.signup + '/:modal?'} component={SignUp} />
                <Route path={Paths.ajoonamu.complete + '/:email'} component={SignupComplete} />
                <Route path={Paths.ajoonamu.recovery} component={Recovery} />
                <Route path={Paths.ajoonamu.recovery_id} component={RecoveryId} />
                <Route path={Paths.ajoonamu.recovery_pw} component={RecoveryPw} />
                <Route path={Paths.ajoonamu.account + '/:modal?'} component={Account} />
                <Route path={Paths.ajoonamu.address + '/:modal?'} component={Address} />
                <Route path={Paths.ajoonamu.mypage} component={MyPage} />
                <Route path={Paths.ajoonamu.product} exact component={DetailMenu} />
                <Route path={Paths.ajoonamu.shop + '/:modal?'} component={Reserve} />
                <Route path={Paths.ajoonamu.breakfast} component={Breakfast} />
                <Route path={Paths.ajoonamu.cart + '/:modal?'} component={Cart} />
                <Route path={Paths.ajoonamu.order + '/:modal?'} component={Order} />
                <Route path={Paths.ajoonamu.order_list} component={OrderList} />
                <Route path={Paths.ajoonamu.order_complete + '/:modal?'} component={OrderComplete} />
                <Route path={Paths.ajoonamu.order_detail} component={OrderDetail} />
                <Route path={Paths.ajoonamu.order_review} component={OrderReview} />
                <Route path={Paths.ajoonamu.coupon} component={Coupon} />
                <Route path={Paths.ajoonamu.find_email} component={FindEmail} />
                <Route path={Paths.ajoonamu.find_password} component={FindPassword} />
                <Route path={`${Paths.ajoonamu.event}/:post?`} component={Event} />
                <Route path={Paths.ajoonamu.notice} component={Notice} />
                <Route path={`${Paths.ajoonamu.support}/:tab?`} component={Support} />
                <Route path={Paths.ajoonamu.update_name} component={UpdateName} />
                <Route path={Paths.ajoonamu.update_password} component={UpdatePassword} />
                <Route path={Paths.ajoonamu.update_phone} component={UpdatePhone} />
                <Route path={Paths.ajoonamu.tos} component={Tos}/>
                <Route path={`${Paths.ajoonamu.oauth}/:type`} component={OAuth}/>
                <Route component={ErrorPage}/>
            </Switch>
            <ModalContainer />
            {bottomNavRender()}
        </div>
    );
};

export default App;
