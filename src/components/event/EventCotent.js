import React from 'react';
import { dateToYYYYMMDD } from '../../lib/formatter';
import styles from './EventContent.module.scss';

export default ({ created_at, ended_at, body, warn }) => {
    return (
        <div className={styles['content']}>
            <div className={styles['info']}>
                <p className={styles['term']}>이벤트 기간: {created_at && dateToYYYYMMDD(created_at)} ~ {ended_at && dateToYYYYMMDD(ended_at)}</p>
                <div className={styles['explain']} dangerouslySetInnerHTML={{ __html: body }} />
            </div>
            <div className={styles['label']}>꼭 확인해주세요!</div>
            <div className={styles['precautions']}>{warn}</div>
        </div>
    );
};