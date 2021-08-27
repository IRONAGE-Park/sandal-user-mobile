import React from 'react';
import classnames from "classnames/bind";
import { Button } from '@material-ui/core';

import Message from '../message/Message';

import styles from './NoticeList.module.scss';
import { dateToRelative } from '../../lib/formatter';
import Cross from '../svg/counter/Cross';

const cn = classnames.bind(styles);

const NoticeItem = ({ notice, onChecked ,onRemove}) => {
    const { not_message,  not_datetime, not_read_datetime } = notice;
    return (
        <li className={cn('list-element', { checked: not_read_datetime })}>
            <Button className={styles['preview']}>
                <div className={styles['text']}  onClick={onChecked}>
                    <p className={styles['message']}>{not_message}</p>
                    <p className={styles['at']}>{dateToRelative(not_datetime)}</p>
                    <div className={styles['delete']}  onClick={onRemove}>
                    <Cross color="#777" angle={45} />
                    </div>
                </div>
            </Button>
        </li>
    );
};

export default ({ listData, onChecked,onRemove }) =>
Array.isArray(listData) && listData.length ? (
    <ul className={styles['notice-list']}>
        {listData.map(notice =>
            <NoticeItem key={notice.not_id} notice={notice} onChecked={() => onChecked(notice.not_id)}  onRemove={()=> onRemove(notice.not_id)}/>
        )}
    </ul>
) : <Message msg="알림이 존재하지 않습니다." />;