import React, { useState } from 'react';
import styles from './PostList.module.scss';
import Back from 'components/svg/header/Back';
import Message from "../../components/message/Message";

import classnames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
import { dateToRelative, dateToYYYYMMDD } from '../../lib/formatter';


const cn = classnames.bind(styles);

const PostItem = ({ postData }) => {
    const {
        title, body, created_at,
    //    updated_at
        question, answer
    } = postData;

    const [open, setOpen] = useState(false);

    return (
        <li className={cn('list-element', { open: open })}>
            <ButtonBase className={styles['preview']} onClick={() => setOpen(!open)}>
                <div className={styles['text']}>
                    <p className={styles['created-at']}>{dateToRelative(created_at, '/')}</p>
                    <h2 className={styles['title']}>{title}{question}</h2>
                </div>
                <Back rotate="270deg"/>
            </ButtonBase>
            <div className={styles['content']}>
                <p dangerouslySetInnerHTML={{ __html: body ? body : answer}} />
                <p className={styles['created-at']}>일시: {dateToYYYYMMDD(created_at)}</p>
                <div className={styles['thanks']}>
                    <p>감사합니다.</p>
                    <p>샌달 드림</p>
                </div>
            </div>
        </li>
    )
}

export default ({ listData, emptyMessage }) => 
    Array.isArray(listData) && listData.length ? (
        <ul className={styles['post-list']}>
            {listData.map((postData) => 
                <PostItem postData={postData} key={postData.id} />
            )}
        </ul>
    ) : <Message msg={emptyMessage} />;
