import React, { useReducer, useState, useRef,useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './QNAContainer.module.scss';
import classNames from 'classnames/bind';


//components
import TabMenu from '../../components/tab/TabMenu';
import QNASend from '../../components/support/QNASend';
import QNAList from '../../components/support/QNAList';
import Loading from '../../components/asset/Loading';
import QNADetailModal from '../../components/modal/QNADetailModal';
import { Swiper, SwiperSlide } from 'swiper/react';

//api
import { requestQNADetail, requestQNAList, requestQNAStore, requestQNAUpdate } from '../../api/support/qna';

//lib
import { isEmailForm } from '../../lib/formatChecker';
import { Paths } from '../../paths';

//hooks
import { useStore } from '../../hooks/useStore';
import { useModal } from '../../hooks/useModal';




const cn = classNames.bind(styles);

const tabInit = [
    {
        url: `${Paths.ajoonamu.support}/qna/send`,
        name: '문의하기',
    },
    {
        url: `${Paths.ajoonamu.support}/qna/list`,
        name: '문의 내역 확인',
    },
];

const reducer = (state, action) => {
    switch (action.type) {
        case 'ON_CHANGE':
            return {
                ...state,
                [action.name]: action.value,
            };
        case 'FULL_CHANGE': 
            return {
                ...state,
                ...action
            };
        default:
            return state;
    }
}

const QNAContainer = ({ tab = 'send', query }) => {
    // QNASend
    const SWIPER = useRef(null);
    const history = useHistory();
    const openModal = useModal();
    const user_token = useStore();
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        title: '',
        content: '',
        email: '',
    });
    const [files, setFiles] = useState([]);

    const onChangeTabIndex = (e, value) => {
        setIndex(value);
        SWIPER.current.slideTo(value, 300);

    };
    const onChangeSwiperIndex = (index) => {
        setIndex(index);
        const tab = index === 0 ? 'send' : 'list';
        history.replace(`${Paths.ajoonamu.support}/qna/${tab}`);
    };

    const onOpenModalDetailView = id => history.push(Paths.ajoonamu.support + '/qna/' + tab + '?id=' + id);
    const onCloseModalDetailView = () => history.goBack();

    const sendQNAUpdate = useCallback(async () => {
        if (isEmailForm(state.email)) {
            const { title, content } = state;
            if (user_token) {
                setLoading(true);
                try {
                    const res = await requestQNAUpdate(user_token, {
                        id: query,
                        title,
                        content,
                        files,
                    });
                    if (res.data.msg === '성공') {
                        openModal('수정이 완료되었습니다!', '답변이 올 때까지는 조금 시간이 소요됩니다.', () => {
                            history.replace(`${Paths.ajoonamu.mypage}`);
                        });
                    } else {
                        openModal('수정하는 도중 오류가 발생했습니다!', '다시 시도해 주세요.');
                    }
                } catch (e) {
                    openModal('서버에 오류가 발생하겼습니다!', '잠시 후 다시 시도해 주세요.');
                }
                setLoading(false);
            }
        } else {
            openModal('이메일이 형식에 맞지 않습니다!', '확인 후 다시 작성해 주세요.');
        }
    }, [state, user_token, query, files, openModal, history]);

    const sendQNAItem = useCallback(async () => {
        /*
            문의하기 등록 버튼.
        */
        setLoading(true);
        if (isEmailForm(state.email)) {
            if (user_token) {
                try {
                    const res = await requestQNAStore(user_token, { ...state, files });
                    if (res.data.msg === "성공") {
                        openModal('성공적으로 작성하였습니다!', '답변이 올 때까지는 조금 시간이 소요됩니다.', () => {
                            history.replace(`${Paths.ajoonamu.mypage}`);
                        });
                    } else {
                        openModal('작성하는 도중 오류가 발생했습니다!', '다시 시도해 주세요.');
                    }
                } catch (e) {
                    openModal('서버에 오류가 발생하겼습니다!', '잠시 후 다시 시도해 주세요.');
                }
            }
        } else {
            openModal('이메일이 형식에 맞지 않습니다!', '확인 후 다시 작성해 주세요.');
        }
        setLoading(false);
    }, [state, files, user_token, history, openModal]);
    const onChange = ({ target }) => dispatch({ type: 'ON_CHANGE', name: target.name, value: target.value });
    // QNASend

    // QNAList
    const [qnaList, setQnaList] = useState([]);
    const onRemoveList = useCallback(id => setQnaList(list => list.filter(item => item.id !== id)), []);
    const getQNAList = useCallback(async () => {
        /*
            1:1 문의 내역 불러오기
        */
        setLoading(true);
        if (user_token) {
            const res = await requestQNAList(user_token);
            const { qnas } = res;
            setQnaList(qnas);
        } else {
            openModal('서버에 오류가 발생하겼습니다!', '잠시 후 다시 시도해 주세요.');
        }
        setLoading(false);
    }, [user_token, openModal]);

    const callGetDetail = useCallback(async () => {
        setLoading(true);
        try  {
            const res = await requestQNADetail(user_token, query);
            if (res.data.query !== null) {
                const { subject, question } = res.data.query;
                dispatch({
                    type: 'FULL_CHANGE',
                    title: question,
                    content: subject
                });
            } else {
                openModal('없거나 삭제된 게시물입니다.', '게시물 번호를 확인해 주세요.');
                history.replace(`${Paths.ajoonamu.mypage}`);
            }
        } catch (e) {
            openModal('서버에 오류가 발생하겼습니다!', '잠시 후 다시 시도해 주세요.');
            history.replace(`${Paths.ajoonamu.mypage}`);
        }
        setLoading(false);
    }, [user_token, query, openModal, history]);

    useEffect(() => {
        if (tab === 'list') getQNAList();
    }, [getQNAList, tab]);
    // QNAList

    useEffect(() => {
        if (tab === 'list') {
            setIndex(1);
        } else {
            setIndex(0);
        }
    }, [tab]);

    useEffect(() => {
        if (query) {
            callGetDetail();
        } else {
            dispatch({
                type: 'FULL_CHANGE',
                title: '',
                content: '',
                email: ''
            });
            setFiles([]);
        }
    }, [callGetDetail, query]);

    return (
        <>
            <Loading open={loading} />
            <TabMenu tabs={tabInit} index={index} onChange={onChangeTabIndex} />
            <div className={cn('container', { list: tab === 'list' })}>
                <Swiper
                    className={styles['swiper']}
                    initialSlide={index}
                    slidesPerView={1}
                    onSlideChange={(swiper) => {
                        onChangeSwiperIndex(swiper.activeIndex);
                    }}
                    autoHeight={true}
                    onSwiper={(swiper) => (SWIPER.current = swiper)}
                >
                    <SwiperSlide className={styles['swiper-slide']}>
                        <QNASend
                            state={state}
                            files={files}
                            setFiles={setFiles}
                            onChange={onChange}
                            onSubmit={query ? sendQNAUpdate : sendQNAItem}
                            isUpdate={query}
                        />
                    </SwiperSlide>
                    <SwiperSlide className={styles['swiper-slide']}>
                        <QNAList
                            listData={qnaList}
                            emptyMessage="등록된 1:1 문의가 없습니다."
                            onClick={onOpenModalDetailView}
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
           {tab === 'list' && <QNADetailModal onRemove={onRemoveList} USER_TOKEN={user_token} viewId={query} handleClose={onCloseModalDetailView} />}
        </>
    );
};

export default QNAContainer;
