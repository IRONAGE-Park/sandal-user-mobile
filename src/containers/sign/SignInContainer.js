import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { Paths, PROTOCOL_ENV } from 'paths';
// styles
import styles from './Sign.module.scss';
import classNames from 'classnames/bind';

//components
import SignNormalInput from 'components/sign/SignNormalInput';
import LinkButton from 'components/button/LinkButton';
import {
    KakaoLogo,
    NaverLogo,
    FacebookLogo,
} from '../../components/svg/sign/social';
//lib
import { isEmailForm } from '../../lib/formatChecker';

//hooks
import { useModal } from '../../hooks/useModal';
import { useInit } from '../../hooks/useStore';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

///api
import { getActiveAddr } from '../../api/address/address';
import { getNearStore } from '../../api/store/store';
import { localLogin, requestPOSTPushToken } from '../../api/auth/auth';
import { reqNoticeList } from '../../api/notice';
import { getMobileOperatingSystem } from '../../api/OS/os';

//store
import { get_user_info } from '../../store/auth/auth';
import { get_notice, read_check } from '../../store/notice/notice';
const cx = classNames.bind(styles);


const initialUserState = {
    email: '',
    password: '',
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_USER_EMAIL':
            return {
                ...state,
                email: action.email,
            };
        case 'UPDATE_USER_PASSWORD':
            return {
                ...state,
                password: action.password,
            };
        default:
            return state;
    }
};

const SignInContainer = () => {
    const initStore = useInit();
    const openModal = useModal();
    const history = useHistory();
    const dispatch = useDispatch();
    const [user, dispatchUser] = useReducer(userReducer, initialUserState);
    const { email, password } = user;
    const [toggle, setToggle] = useState(false);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);


    const updateEmail = (e) => {
        dispatchUser({ type: 'UPDATE_USER_EMAIL', email: e.target.value });
    };

    const updatePassword = (e) => {
        dispatchUser({
            type: 'UPDATE_USER_PASSWORD',
            password: e.target.value,
        });
    };
    const GetNotification = async (token) => {

        try {
            const res = await reqNoticeList(token);
            // setList(res.notification);
            const index = res.notification.findIndex(
                (item) => !item.not_read_datetime,
            );
            dispatch(read_check(index === -1));
            dispatch(get_notice(res.notification));
        } catch (e) {
            console.error(e);
        }
    };

    const onClickSignup = useCallback(() => {
        history.push(Paths.ajoonamu.signup);
    }, [history]);

    const onClickRecovery = useCallback(() => {
        history.push(Paths.ajoonamu.recovery);
    }, [history]);

    const LoginOs = (JWT_TOKEN) => {
        window.setToken = async (token) => {
            try {
                const res = await requestPOSTPushToken(JWT_TOKEN, token);
                if (res.data.msg !== "success") {
                    alert(res.data.msg);
                }
            } catch (e) {
                alert(e);
            }
        }

        const login_os = getMobileOperatingSystem();
        if (login_os === 'Android') {
            if (typeof window.myJs !== 'undefined') {
                window.myJs.requestToken();
            }
        } else if (login_os === 'iOS') {
            if (typeof window.webkit !== 'undefined') {
                if (typeof window.webkit.messageHandlers !== 'undefined') {
                    window.webkit.messageHandlers.requestToken.postMessage("");
                }
            }
        }
    }

    const onClickLogin = useCallback(async () => {
        if (!isEmailForm(email)) {
            openModal(
                '???????????? ????????? ?????? ????????????!',
                '?????? ??? ?????? ????????? ?????????.',
                () => emailInputRef.current.focus()
            );
        } else {
            try {
                const res = await localLogin(email, password);
                if (res.status === 200) {
                    // ???????????? ???????????? ?????????
                    if (res.data.msg === '???????????? ???????????? ?????? ??????????????????.') {
                        openModal(res.data.msg, '???????????? ?????? ??? ??? ????????? ?????????.', () => emailInputRef.current.focus());
                    }
                    // ??????????????? ????????? ???
                    else if (res.data.msg === '??????????????? ???????????????.') {
                        openModal(res.data.msg, '??????????????? ?????? ??? ??? ????????? ?????????.', () => passwordInputRef.current.focus());
                    }
                    // ????????? ???????????? ???.
                    else if (res.data.msg === '????????? ??????????????????.') {
                        openModal(res.data.msg, '???????????? ?????? ??? ??? ????????? ?????????.', () => emailInputRef.current.focus());
                    }
                    // ????????? ?????? ?????? ???.
                    else if (res.data.access_token) {
                        LoginOs(res.data.access_token);
                        // ?????? ?????? ???????????? ????????????
                        dispatch(get_user_info(res.data.access_token));
                        const active_addr = await getActiveAddr(res.data.access_token);
                        localStorage.setItem('access_token', res.data.access_token);
                        if (active_addr) {
                            const {
                                lat,
                                lng,
                                addr1,
                                addr2,
                                post_num,
                            } = active_addr;
                            const near_store = await getNearStore(
                                res.data.access_token,
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
                        GetNotification(res.data.access_token);
                        history.replace('/');
                    }
                } else {
                    openModal(
                        '???????????? ?????????????????????.',
                        '????????? ?????? ??????????????? ??????????????????.',
                        () => emailInputRef.current.focus()
                    );
                }
            } catch (e) {
                openModal('????????? ???????????????.', '?????? ??? ????????? ????????????.');
                history.replace('/');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, openModal, password, dispatch, history, initStore]);



    const kakaoLoginClickHandler = () => {
        window.location =
            PROTOCOL_ENV + 'api.ajoonamu.com/api/user/kakao?device=mobile';
    };

    const naverLoginClickHandler = () => {
        window.location =
            PROTOCOL_ENV + 'api.ajoonamu.com/api/user/naver?device=mobile';
    };

    const facebookLoginClickHandler = () => {
        window.location =
            PROTOCOL_ENV + 'api.ajoonamu.com/api/user/facebook?device=mobile';
    };

    useEffect(() => {
        const btnToggle =
            email.length !== 0 && password.length !== 0 ? true : false;
        setToggle(btnToggle);
    }, [email, password]);

    const kepressEvent = e => {
        if (e.key === 'Enter') {
            onClickLogin();
        }
    };


    return (
        <>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <SignNormalInput
                        inputType={'email'}
                        initValue={user.email}
                        onChange={updateEmail}
                        placeholder={'?????????'}
                        reference={emailInputRef}
                        onKeyDown={kepressEvent}
                    />
                    <SignNormalInput
                        inputType={'password'}
                        initValue={user.password}
                        onChange={updatePassword}
                        reference={passwordInputRef}
                        placeholder={'????????????'}
                        onKeyDown={kepressEvent}
                    />
                    <div className={styles['login-btn']}>
                        <LinkButton
                            title={'?????????'}
                            onClick={onClickLogin}
                            toggle={toggle}
                        />
                    </div>
                    <div className={styles['link-table']}>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickSignup}
                        >
                            <div className={styles['sub-text']}>????????????</div>
                        </div>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickRecovery}
                        >
                            <div className={styles['sub-text']}>???????????????</div>
                        </div>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickRecovery}
                        >
                            <div className={styles['sub-text']}>
                                ??????????????????
                            </div>
                        </div>
                    </div>
                    <div className={styles['sns-box']}>
                        <div className={styles['social-login']}>
                            <div className={styles['text']}>?????? ?????????</div>
                            <div className={styles['line']}></div>
                        </div>
                        <div className={styles['social']}>
                            <div className={styles['sns']}>
                                <img src={NaverLogo} alt="naver" onClick={naverLoginClickHandler}></img>
                            </div>
                            <div className={styles['sns']}>
                               <img src={KakaoLogo} alt="kakao" onClick={kakaoLoginClickHandler}></img>    
                            </div>
                            <div className={styles['sns']}>
                                <img src={FacebookLogo} alt="facebook" onClick={facebookLoginClickHandler} /> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignInContainer;
