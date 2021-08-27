import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Button } from '@material-ui/core';
import Message from '../message/Message';

import styles from './QNAList.module.scss';

import { dateToRelative } from '../../lib/formatter';

const cn = classNames.bind(styles);

const QNAList = ({ listData, emptyMessage, onClick }) => {
    return Array.isArray(listData) && listData.length ? (
        <ul className={styles['qna-list']}>
            {listData.map((qnaData) => {
                return <QNAItem qnaData={qnaData} key={qnaData.id} onClick={() => onClick(qnaData.id)}/>
            }
            )}
        </ul>
    ) : <Message msg={emptyMessage} />;
};
QNAList.defalutProps = {
    listData: [],
    emptyMessage: ""
};
QNAList.propTypes = {
    listData: PropsTypes.array.isRequired,
    emptyMessage: PropsTypes.string
};

const QNAItem = ({ qnaData, onClick }) => {
    const {
        status, subject, name,
        q_datetime
    } = qnaData;

    return (
        <li className={styles['list-element']}>
            <Button className={styles['preview']} onClick={onClick}>
                <div className={styles['content']}>
                    <h2 className={styles['subject']}>{subject}</h2>
                    <p className={styles['text']}>
                        <span className={styles['name']}>{name}</span>
                        {/* <span className={styles['date-time']}>{q_datetime}</span> */}
                        <span className={styles['date-time']}>{dateToRelative(q_datetime, '-')}</span>
                    </p>
                </div>
                <div>
                    <div className={cn('tag', { complete: status !== 0 } )}>
                        {status === 0 ? '답변대기' : '답변완료'}                        
                    </div>
                </div>
            </Button>
        </li>
    )
}

export default QNAList;
