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
                '이메일이 형식에 맞지 않습니다!',
                '확인 후 다시 작성해 주세요.',
                () => emailInputRef.current.focus()
            );
        } else {
            try {
                const res = await localLogin(email, password);
                if (res.status === 200) {
                    // 회원가입 안되있는 이메일
                    if (res.data.msg === '회원가입 되어있지 않은 이메일입니다.') {
                        openModal(res.data.msg, '아이디를 다시 한 번 확인해 주세요.', () => emailInputRef.current.focus());
                    }
                    // 비밀번호가 틀렸을 때
                    else if (res.data.msg === '비밀번호가 틀렸습니다.') {
                        openModal(res.data.msg, '비밀번호를 다시 한 번 확인해 주세요.', () => passwordInputRef.current.focus());
                    }
                    // 탈퇴한 이메일일 때.
                    else if (res.data.msg === '탈퇴한 이메일입니다.') {
                        openModal(res.data.msg, '아이디를 다시 한 번 확인해 주세요.', () => emailInputRef.current.focus());
                    }
                    // 로그인 성공 했을 때.
                    else if (res.data.access_token) {
                        LoginOs(res.data.access_token);
                        // 토큰 넘겨 유저정보 디스패치
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
                        '로그인에 실패하였습니다.',
                        '이메일 혹은 패스워드를 확인해주세요.',
                        () => emailInputRef.current.focus()
                    );
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
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
                        placeholder={'이메일'}
                        reference={emailInputRef}
                        onKeyDown={kepressEvent}
                    />
                    <SignNormalInput
                        inputType={'password'}
                        initValue={user.password}
                        onChange={updatePassword}
                        reference={passwordInputRef}
                        placeholder={'비밀번호'}
                        onKeyDown={kepressEvent}
                    />
                    <div className={styles['login-btn']}>
                        <LinkButton
                            title={'로그인'}
                            onClick={onClickLogin}
                            toggle={toggle}
                        />
                    </div>
                    <div className={styles['link-table']}>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickSignup}
                        >
                            <div className={styles['sub-text']}>회원가입</div>
                        </div>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickRecovery}
                        >
                            <div className={styles['sub-text']}>아이디찾기</div>
                        </div>
                        <div
                            className={styles['table-cell']}
                            onClick={onClickRecovery}
                        >
                            <div className={styles['sub-text']}>
                                비밀번호찾기
                            </div>
                        </div>
                    </div>
                    <div className={styles['sns-box']}>
                        <div className={styles['social-login']}>
                            <div className={styles['text']}>간편 로그인</div>
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
