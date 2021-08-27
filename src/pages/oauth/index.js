import React, { useEffect } from 'react';
import qs from 'qs';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

//api
import { getActiveAddr } from '../../api/address/address';
import { getNearStore } from '../../api/store/store';
import { socialRegister } from '../../api/social';
//hooks
import { useInit } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';

//store
import { get_user_info } from '../../store/auth/auth';
import { requestPOSTPushToken } from '../../api/auth/auth';
import { getMobileOperatingSystem } from '../../api/OS/os';

const OAuth = ({ match, location }) => {
    const history = useHistory();
    const openModal = useModal();
    const dispatch = useDispatch();
    const initStore = useInit();

    const { type } = match.params; //
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });


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

    const GetInfo = async (access_token) => {
        if (access_token) {
            try {
                dispatch(get_user_info(access_token));
                const res = await getActiveAddr(access_token);
                if (res) {
                    const { lat, lng, addr1, addr2, post_num } = res;
                    const near_store = await getNearStore(access_token,lat, lng, addr1);
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
                LoginOs(access_token);
                localStorage.setItem('access_token', access_token);

                history.replace('/');
            } catch (e) {
                history.replace('/error');
            }
        }
    };

    const Register = async (email, name, register_type) => {
        try {
            if (register_type === 'already') {
                history.replace('/');
                openModal(
                    '회원가입 실패',
                    '존재하는 이메일 주소로 가입을 시도하셔서 가입에 실패하셨습니다.',
                );
            } else {
                const res = await socialRegister(email, name, register_type);
                if (res.data.access_token) {
                    dispatch(get_user_info(res.data.access_token));
                    localStorage.setItem('access_token', res.data.access_token);
                    initStore();
                    history.replace('/');
                }
            }
        } catch (e) {
            history.replace('/error');
        }
    };

    useEffect(() => {
        const { email, access_token, register_type, name } = query;

        if (type === 'login') {
            GetInfo(access_token);
        } else if (type === 'register') {
            Register(email, name, register_type);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};

export default OAuth;
