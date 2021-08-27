import React, { useState, useCallback, useEffect } from 'react';
import EventImage from '../../components/event/EventImage';
import EventCotent from '../../components/event/EventCotent';

import { requestEventPost } from '../../api/event';

import styles from './EventContainer.module.scss';
import Loading from '../../components/asset/Loading';
import { DBImageFormat } from '../../lib/formatter';
import { useModal } from '../../hooks/useModal';
import { useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import ErrorCoverImage from '../../components/asset/ErrorCoverImage';

export default ({ id }) => {
    const openModal = useModal();
    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState({});

    const getEventPost = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await requestEventPost(id);
            if (res.data.msg === '성공') {
                if (res.data.query.event) {
                    setEventData(res.data.query.event);
                } else {
                    openModal('지워지거나 없는 게시물입니다.', '다시 시도 해주세요.');    
                    history.push(Paths.index);
                }
            } else {
                openModal('이벤트 내용을 가져오는데 오류가 발생했습니다.', '잠시 후 재시도 해주세요.');
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
        setLoading(false);
    }, [openModal, history]);

    useEffect(() => {
        getEventPost(parseInt(id));
    }, [getEventPost, id]);

    const { created_at, end_date, body, warn, images_detail } = eventData;
    return (
        <>
            {!loading && (
                <div className={styles['container']}>
                    <Loading open={loading} />
                    <div className={styles['event-detail']}>
                    {images_detail &&
                    images_detail !== '[]' &&
                    DBImageFormat(images_detail).map(image_detail =>
                    <ErrorCoverImage className={styles['detail-image']} src={image_detail} alt="상세 이미지" key={image_detail} />)}
                    </div>
                    <EventCotent
                        created_at={created_at}
                        ended_at={end_date}
                        body={body}
                        warn={warn}
                    />
                </div>
            )}
            <Loading open={loading} />
        </>
    );
};
