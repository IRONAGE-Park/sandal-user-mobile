import React, { useEffect, useState, useCallback } from 'react';
import styles from './EventListContainer.module.scss';
import { requestEventList } from '../../api/event';
import EventList from '../../components/event/EventList';
import Loading from '../../components/asset/Loading';
import { useModal } from '../../hooks/useModal';

export default () => {
    const openModal = useModal();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getEventList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestEventList();
            if (res.data.msg === '성공') {
                setList(res.data.query.events);
            } else {
                openModal(
                    '이벤트 목록을 가져오는데 오류가 발생했습니다.',
                    '잠시 후 재시도 해주세요.',
                );
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
        setLoading(false);
    }, [openModal]);

    useEffect(() => {
        getEventList();
    }, [getEventList]);

    return (
        <>
            {loading ? (
                <Loading open={true} />
            ) : (
                <div className={styles['container']}>
                    <EventList listData={list} />
                </div>
            )}
        </>
    );
};
