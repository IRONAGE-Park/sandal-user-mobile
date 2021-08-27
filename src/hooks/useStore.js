import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useModal } from './useModal';

import { get_address } from '../store/address/address';
import { get_near_store } from '../store/address/store';
import { get_menulist } from '../store/product/product';

import  { init as notice_init} from '../store/notice/notice';
import  { init as prefer_init} from '../store/product/prefer';
import { Paths } from '../paths';


//스토어 초기화 해줘야할때.
//1.로그인시 (주소초기화 , 알림창 초기화 , 가까운가게 초기화)
//2.첫 로딩시 (비회원 주소초기화 , 알림창 초기화 ,가까운 가게 초기화)
//3.로그아웃 시 (비회원 주소초기화 ,알림창 초기화 ,가까운 가게 초기화)
//4. 회원탈퇴시 (비회원 주소 초기화, 알림창 초기화 ,가까운 가게 초기화)
export const useStore = (isReplace = true) => {
    const user_token = localStorage.getItem('access_token');
    const history = useHistory();
    const openModal = useModal();

    useEffect(() => {
        if (!user_token && isReplace) {
            openModal(
                '로그인이 필요한 서비스입니다.',
                '로그인 후에 이용해 주세요.',
                ()=> history.replace(Paths.ajoonamu.signin),
                ()=> history.replace(Paths.ajoonamu.signin)
            );
        }
    }, [user_token, history, openModal, isReplace]);

    return user_token;
};

export const useUrl = () => {
    const location = useLocation();
    const [current, setCurrent] = useState('/');
    const [prev, setPrev] = useState('');

    useEffect(() => {
        if (location.pathname !== Paths.ajoonamu.address) {
            // 주소지의 경우 원래 자리로 가야하기 때문에 예외처리
            setCurrent(location.pathname+location.search);
            setPrev(current);
            const obj = {
                current: location.pathname + location.search,
                prev: current,
            };
            sessionStorage.setItem('url', JSON.stringify(obj));
        }
    }, [location.pathname]);

    return { prev, current };
};
export const useAddr = () => {
    const user_addr = sessionStorage.getItem('user_addr');
    return user_addr;
};
export const useInit = () => {
    const dispatch = useDispatch();
    const initStore = (
        addr1 = null,
        addr2 = null,
        lat = null,
        lng = null,
        post_num = null,
        near_store = null,
    ) => {
        dispatch(notice_init());
        dispatch(prefer_init());
        dispatch(get_address({ addr1, addr2, lat, lng, post_num }));
        dispatch(get_near_store(near_store));
        dispatch(get_menulist(null));

    };
    return initStore;
};
