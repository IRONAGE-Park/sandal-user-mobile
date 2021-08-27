/*global kakao*/

//hooks
import React, { useState, useEffect, useCallback } from 'react';
import {useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useInit, useStore } from '../../hooks/useStore';

//style
import styles from './Address.module.scss';
import classNames from 'classnames/bind';

//components
import DeliveryItemList from 'components/address/DeliveryItemList';
import { BsSearch } from 'react-icons/bs';
import AddressModal from '../../components/modal/AddressModal';
import MapModal from '../../components/kakao_map/MapModal';
import Loading from '../../components/asset/Loading';
import Message from '../../components/message/Message';
import { ButtonBase, IconButton } from '@material-ui/core';

//api
import {
    insertAddress,
    searchAddress,
    selectAddress,
    getDeliveryList,
    deleteAddr,
} from '../../api/address/address';
import { getNearStore } from '../../api/store/store';
import { noAuthGetNearStore } from '../../api/noAuth/store';

//store
import { modalOpen } from '../../store/modal';
import { Paths } from '../../paths';


const cx = classNames.bind(styles);

const AddressContainer = ({ modal }) => {
    const history = useHistory();
    const user_token = useStore(false);
    const modalDispatch = useDispatch();
    const initStore = useInit();
    const dispatch = useDispatch();

    const openMessage = useCallback(
        (isConfirm, title, text, handleClick = () => {}) => {
            modalDispatch(modalOpen(isConfirm, title, text, handleClick));
        },
        [modalDispatch],
    );

    const [loading, setLoading] = useState(false);
    const [searchAddr, setSearchAddr] = useState(''); //검색
    const [selectAddr, setSelectAddr] = useState(''); //선택
    const [detailAddr, setDetailAddr] = useState(''); //상세주소
    const [searchList, setSearchList] = useState([]); // 검색 리스트
    // const [position, setPosition] = useState({
    //     lat: 0, lng: 0
    // });
    const [deliveryList, setDeliveryList] = useState([]);
    const [post_num, setPostNum] = useState('');


    const onCloseModal = () => history.replace(Paths.index);
    const onOpenModalSearch = () => history.push(Paths.ajoonamu.address + '/search');
    const onOpenModalMap = () => history.push(Paths.ajoonamu.address + '/map');

    const onMovePrevUrl = () => {
        history.replace(Paths.index);
        // const url = JSON.parse(sessionStorage.getItem('url'));
        // if (url) {
        //     history.push(url.prev);
        // }
    }

    //검색 아이템 클릭
    const onClickAddrItem = (data, zipNo) => {
        setSelectAddr(data);
        setPostNum(zipNo);
    };
    //검색어 변경
    const onChangeSearchAddr = useCallback((e) => {
        setSearchAddr(e.target.value);
    }, []);

    //상세주소 설정
    const onChangeDetailAddr = (e) => {
        setDetailAddr(e.target.value);
    };

    //선택한 주소지 불러오기
    const callDeliveryList = useCallback(async () => {
        setLoading(true);
        if(user_token){
            try{
                const res = await getDeliveryList(user_token);
                setDeliveryList(res.data.query);
            }
            catch(e){
                console.error(e);
            }
        }
        else{
            const noAuthAddrs = JSON.parse(localStorage.getItem('noAuthAddrs'));
            if (noAuthAddrs) {
                setDeliveryList(noAuthAddrs);
            }
        }
        setLoading(false);
    }, [user_token]);

    //지도 닫기
    const onClickMapClose = useCallback(() => {
        onCloseModal();

        setDetailAddr('');
        // setPosition({ lat: null, lng: null });
    }, []);


    //검색창 열기
    const handleClickOpen = () => {
        if (searchAddr === '') {
            alert('검색어를 입력해주세요.');
            return;
        } else {
            onOpenModalSearch();
            onChangeSearch();
        }
    };

    //검색창 닫기
    const handleClose = () => {
        onCloseModal();
        setDetailAddr('');
        setSelectAddr('');
    };

    //엔터키
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleClickOpen();
        }
    };

    // 좌표 변경
    // const onClickPosition = useCallback((lat, lng) => {
    //     setPosition({ lat: lat, lng: lng });
    // }, []);

    //검색 하기
    const onChangeSearch = async () => {
        if (searchAddr === '') {
            return;
        } else {
            const result = await callSearchApi();
            setSearchList(result);
        }
    };

    //검색 api 호출
    const callSearchApi = async () => {
        try {
            const res = await searchAddress(searchAddr);
            return res;
        } catch (e) {
            console.error(e);
        }
    };

    //주소지 삭제
    const onRemoveAddr = useCallback(
        (delivery_id) => {
            openMessage(true, '해당 주소를 삭제하시겠습니까?', '삭제하시면 복구할 수 없습니다.', async () => {
                if (user_token) {
                    try {
                        await deleteAddr(user_token, delivery_id);
                        const index = deliveryList.findIndex((item) => item.delivery_id === delivery_id);

                        //삭제하려는 주소가 활성화 주소라면 배달지 설정 초기화
                        if (deliveryList[index].active === 1) {
                            initStore();
                        }
                        setDeliveryList((list) => list.filter((item) => item.delivery_id !== delivery_id));
                    } catch (e) {
                        
                    }
                } else {
                    const noAuthAddrs = JSON.parse(
                        localStorage.getItem('noAuthAddrs'),
                    );
                    if (noAuthAddrs) {
                        //선택한 주소가 현재 활성 주소일시.
                        if (noAuthAddrs.length !== 0) {
                            if (noAuthAddrs[delivery_id].active === 1) {
                                initStore();
                            }
                            //선택한 주소를 제일 위로 올리기.
                            noAuthAddrs.splice(delivery_id, 1);
                            localStorage.setItem('noAuthAddrs', JSON.stringify(noAuthAddrs));
                            const temp = JSON.parse(localStorage.getItem('noAuthAddrs'));
                            setDeliveryList(temp);
                        }
                    }
                }
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [openMessage, user_token, deliveryList, dispatch],
    );



    //선택한 주소지로 설정 하기
    const onClickDeliveyAddr = useCallback(
        (delivery_id, addr1, addr2, lat, lng, post_num) => {
            openMessage(
                true,
                '선택한 주소지로 설정하시겠습니까?',
                '선택하신 주소지에서 가장 가까운 지점으로 연결됩니다.',
                async () => {
                    if (user_token) {
                        try {
                            // const res = await selectAddress(user_token, delivery_id);
                            await selectAddress(user_token, delivery_id);
                            const near_store = await getNearStore(
                                user_token,
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
                                onMovePrevUrl();

                            // callDeliveryList();

                        } catch (e) {}
                    } else {
                        //로컬 스토리지에 있는 아이템을 들고온다.
                        //선택한 주소지가 있다는 것은 로컬스토리지에 아이템이 있다고 판단하고 조건을 뺀다.
                        const noAuthAddrs = JSON.parse(
                            localStorage.getItem('noAuthAddrs'),
                        );

                        //모든 활성화를 0으로 초기화
                        noAuthAddrs.map((item) => (item.active = 0));

                        //선택한 주소를 활성화
                        noAuthAddrs[delivery_id].active = 1;

                        //활성화된 스토리지의 주소를 제일 위로 올린다.
                        let tmp = noAuthAddrs[delivery_id];
                        noAuthAddrs.splice(delivery_id, 1);
                        noAuthAddrs.unshift(tmp);

                        //활성화된 정보를 갱신
                        localStorage.setItem(
                            'noAuthAddrs',
                            JSON.stringify(noAuthAddrs),
                        );

                        //갱신한 뒤 상태 업데이트 및 리덕스 업데이트
                        const temp = JSON.parse(
                            localStorage.getItem('noAuthAddrs'),
                        );
                        setDeliveryList(temp);
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

                        onMovePrevUrl();
                    }
                },
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [callDeliveryList, dispatch, openMessage, user_token],
    );


        
    //최근 주소지에 추가
    const onClickDeliveryAddrInsert = async () => {
        if (selectAddr === '') {
            openMessage(
                false,
                '주소가 선택되지 않았습니다.',
                '주소를 선택해주세요.',
            );
        } else if (detailAddr === '') {
            openMessage(
                false,
                '상세 주소를 입력해주세요',
                '상세 주소가 입력되지 않았습니다.',
            );
        } else {
            openMessage(
                true,
                '이 주소로 배달지를 설정하시겠습니까?',
                '선택하신 주소지에서 가장 가까운 지점으로 연결됩니다.',
                async () => {
                    if (user_token) {
                        try {
                            var geocoder = new kakao.maps.services.Geocoder();
                            var temp_lat, temp_lng;
                            //선택한 주소의 좌표정보 받아오기
                            geocoder.addressSearch(selectAddr, async function (
                                result,
                                status,
                            ) {
                                // 정상적으로 검색이 완료됐으면
                                if (status === kakao.maps.services.Status.OK) {
                                    temp_lat = result[0].y;
                                    temp_lng = result[0].x;
                                    try {
                                        const res = await insertAddress(
                                            user_token,
                                            post_num,
                                            selectAddr,
                                            detailAddr,
                                            0,
                                            temp_lat,
                                            temp_lng,
                                        );
                                        if (res.data.msg === '성공') {
                                            const near_store = await getNearStore(user_token,temp_lat, temp_lng, selectAddr);
                                        
                                            initStore(selectAddr, detailAddr, temp_lat, temp_lng, post_num,near_store.data.query);

                                            // callDeliveryList();
                                            onMovePrevUrl();
                                            setSearchAddr('');


                                        } else {
                                            openMessage(
                                                false,
                                                res.data.msg,
                                                '주변 매장정보를 확인해 주세요.',
                                            );
                                        }
                                    } catch (e) {
                                        setLoading(false);
                                    }
                                }
                                //검색이 완료되지 않앗으면.
                                else {
                                    setLoading(false);
                                }
                            });
                        } catch (e) {
                            
                        }
                    }
                    //비회원 
                    else {
                        let geocoder = new kakao.maps.services.Geocoder();
                        let temp_lat, temp_lng;
                        //선택한 주소의 좌표정보 받아오기
                        geocoder.addressSearch(selectAddr, async function (
                            result,
                            status,
                        ) {
                            // 정상적으로 검색이 완료됐으면
                            if (status === kakao.maps.services.Status.OK) {
                                temp_lat = result[0].y;
                                temp_lng = result[0].x;
                                try{
                                    const near_store = await noAuthGetNearStore(temp_lat, temp_lng, selectAddr);
                                    if(near_store.data.msg==="배달 가능한 지역이 아닙니다."){
                                        openMessage(
                                            false,
                                            near_store.data.msg,
                                            '주변 매장정보를 확인해 주세요.',
                                        );
                                    }
                                    else if(near_store.data.msg==='배달 가능한 매장이 없습니다.'){
                                        openMessage(
                                            false,
                                            near_store.data.msg,
                                            '주변 매장정보를 확인해 주세요.',
                                        );
                                    }
                                    //배달 가능한 지역이라면
                                    else{
                                        //비회원일시 로컬스토리지에서 아이템을 들고온다.
                                        const noAuthAddrs = JSON.parse(
                                            localStorage.getItem('noAuthAddrs'),
                                        );
                                        //로컬 스토리지에 아이템이 있을시.
                                        if (noAuthAddrs) {
                                            //모든 활성화를 0으로 초기화
                                            noAuthAddrs.map(
                                                (item) => (item.active = 0),
                                            );
                                            //새로운 주소를 푸쉬
                                            noAuthAddrs.push({
                                                addr1: selectAddr,
                                                addr2: detailAddr,
                                                lat: temp_lat,
                                                lng: temp_lng,
                                                post_num: post_num,
                                                active: 1,
                                            });
                                            localStorage.setItem(
                                                'noAuthAddrs',
                                                JSON.stringify(
                                                    noAuthAddrs.reverse(),
                                                ),
                                            );
                                        }
                                        //로컬스토리지에 아이템이 없을시.
                                        else {
                                            localStorage.setItem(
                                                'noAuthAddrs',
                                                JSON.stringify([
                                                    {
                                                        addr1: selectAddr,
                                                        addr2: detailAddr,
                                                        lat: temp_lat,
                                                        lng: temp_lng,
                                                        post_num: post_num,
                                                        active: 1,
                                                    },
                                                ]),
                                            );
                                        }
                                        //모든 작업이 완료 되었다면. 리덕스에 좌표정보저장, 추가된 배열로 상태 업데이트
                                        const test2 = JSON.parse(
                                            localStorage.getItem('noAuthAddrs'),
                                        );
                                    
                                        initStore(selectAddr, detailAddr, temp_lat, temp_lng, post_num,near_store.data.query);
                                        setDeliveryList(test2);
                                        setSearchAddr('');
                                        onMovePrevUrl();
                                    }


                                }

                                catch(e){
                                    
                                }
                               
                            }

                            //검색이 완료되지 않앗으면.
                            else {
                                setLoading(false);
                            }
                        });
                    }

                },
            );
        }
    };



        //최근 주소지에 추가
        const onClickMapInsertAddr = async (jibun,detail,lat,lng) => {
            if (jibun === '') {
                openMessage(
                    false,
                    '주소가 선택되지 않았습니다.',
                    '주소를 선택해주세요.',
                );
            } else if (detail === '') {
                openMessage(
                    false,
                    '상세 주소를 입력해주세요',
                    '상세주소가 입력되지 않았습니다.',
                );
            } else {
                openMessage(
                    true,
                    '이 주소로 배달지를 설정하시겠습니까?',
                    '',
                    async () => {
                        if (user_token) {
                                try {
                                    const res = await insertAddress(
                                        user_token,
                                        0,
                                        jibun,
                                        detail,
                                        0,
                                        lat,
                                        lng,
                                    );
                                    if (res.data.msg === '성공') {
                                        const near_store = await getNearStore(
                                            user_token,
                                            lat,
                                            lng,
                                            jibun,
                                        );

                                        initStore(
                                            jibun,
                                            detail,
                                            lat,
                                            lng,
                                            0,
                                            near_store.data.query,
                                        );
                                        // callDeliveryList();
                                        onMovePrevUrl();

                                    } else {
                                        openMessage(
                                            false,
                                            res.data.msg,
                                            '주변 매장정보를 확인해 주세요.',
                                        );
                                    }
                                } catch (e) {
                                    setLoading(false);
                                }
                        }
                        //비회원 
                        else {
                     
                            try{
                                const near_store = await noAuthGetNearStore(lat, lng, jibun);
                                if(near_store.data.msg==="배달 가능한 지역이 아닙니다."){
                                    openMessage(
                                        false,
                                        near_store.data.msg,
                                        '주변 매장정보를 확인해 주세요.',
                                    );
                                }
                                else if(near_store.data.msg==='배달 가능한 매장이 없습니다.'){
                                    openMessage(
                                        false,
                                        near_store.data.msg,
                                        '주변 매장정보를 확인해 주세요.',
                                    );
                                }

                                //배달 가능한 지역이라면
                                else{
                                    //비회원일시 로컬스토리지에서 아이템을 들고온다.
                                    const noAuthAddrs = JSON.parse(
                                        localStorage.getItem('noAuthAddrs'),
                                    );
                                    //로컬 스토리지에 아이템이 있을시.
                                    if (noAuthAddrs) {
                                        //모든 활성화를 0으로 초기화
                                        noAuthAddrs.map(
                                            (item) => (item.active = 0),
                                        );
                                        //새로운 주소를 푸쉬
                                        noAuthAddrs.push({
                                            addr1: jibun,
                                            addr2: detail,
                                            lat: lat,
                                            lng: lng,
                                            post_num: 0,
                                            active: 1,
                                        });
                                        localStorage.setItem(
                                            'noAuthAddrs',
                                            JSON.stringify(
                                                noAuthAddrs.reverse(),
                                            ),
                                        );
                                    }
                                    //로컬스토리지에 아이템이 없을시.
                                    else {
                                        localStorage.setItem(
                                            'noAuthAddrs',
                                            JSON.stringify([
                                                {
                                                    addr1: jibun,
                                                    addr2: detail,
                                                    lat: lat,
                                                    lng: lng,
                                                    post_num: 0,
                                                    active: 1,
                                                },
                                            ]),
                                        );
                                    }
                                    //모든 작업이 완료 되었다면. 리덕스에 좌표정보저장, 추가된 배열로 상태 업데이트
                                    const test2 = JSON.parse(
                                        localStorage.getItem('noAuthAddrs'),
                                    );
                                    initStore(jibun, detail, lat, lng, 0,near_store.data.query);
                                    setDeliveryList(test2);
                                    history.replace(Paths.index);
                                }
                            }
                            catch(e){
                                
                            }
                           
                        }
                    },
                );
            }
        };
    

    useEffect(() => {
        callDeliveryList();
    }, [callDeliveryList]);

    useEffect(() => {
        setSelectAddr('');
        setDetailAddr('');
    }, [modal]);
    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    <div className={styles['container']}>
                        <div className={cx('title', 'pd-box')}>
                            배달 받으실 장소를 입력하세요.
                        </div>
                        <div className={cx('addr-input', 'pd-box')}>
                            <input
                                className={cx('input-box', 'pd-box')}
                                placeholder="예) 샌달동 12-3 또는 샌달 아파트"
                                value={searchAddr}
                                onChange={onChangeSearchAddr}
                                onKeyPress={handleKeyPress}
                            />
                            <IconButton
                                className={cx('search-btn')}
                                onClick={handleClickOpen}
                            >
                                <BsSearch />
                            </IconButton>
                        </div>
                        <div className={styles['pd-box']}>
                            <ButtonBase
                                className={cx('location-btn')}
                                onClick={onOpenModalMap}
                            >
                                현 위치로 주소 설정
                            </ButtonBase>
                        </div>
                        <div className={styles['recently-title']}>
                            최근 배달 주소
                        </div>
                        <div className={cx('addr-list', 'pd-box')}>
                            {deliveryList.length !== 0 ? (
                                <DeliveryItemList
                                    user_token={user_token}
                                    addrs={deliveryList}
                                    onClick={onClickDeliveyAddr}
                                    onRemove={onRemoveAddr}
                                />
                            ) : (
                                <Message
                                    msg={'최근 주소지가 없습니다.'}
                                />
                            )}
                        </div>
                    </div>
                    <AddressModal
                        open={modal === 'search'}
                        handleClose={handleClose}
                        searchAddr={searchAddr}
                        onChangeAddr={onChangeSearchAddr}
                        handleKeyPress={handleKeyPress}
                        onSearch={onChangeSearch}
                        addrs={searchList}
                        onClickAddrItem={onClickAddrItem}
                        selectAddr={selectAddr}
                        detailAddr={detailAddr}
                        onChangeDetail={onChangeDetailAddr}
                        onClick={onClickDeliveryAddrInsert}
                    />
                    <MapModal
                        open={modal === 'map'}
                        // position={position}
                        onClick={onClickMapInsertAddr}
                        handleClose={onClickMapClose}
                        // onClickPosition={onClickPosition}
                    />
                </>
            )}
        </>
    );
};

export default AddressContainer;
