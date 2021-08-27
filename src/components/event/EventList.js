import React from 'react';
import { ButtonBase } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Message from '../message/Message';

import { Paths } from '../../paths';
import styles from './EventList.module.scss';
import { DBImageFormat } from '../../lib/formatter';
// import ErrorCoverImage from '../asset/ErrorCoverImage';
import CoverImage from '../asset/CoverImage';

const EventListItem = ({ event }) => (
    <li className={styles['list-element']}>
        <ButtonBase className={styles['preview']}>
            <Link className={styles['link']} to={`${Paths.ajoonamu.event}/${event.id}`}>
                <CoverImage className={styles['banner']} src={DBImageFormat(event.images_mobile)[0]} vertical_rate="60%" />
            </Link>
        </ButtonBase>
    </li>
);

export default ({ listData }) =>
    Array.isArray(listData) && listData.length ? (
    <ul className={styles['event-list']}>
        {listData.map(event => (
            <EventListItem event={event} key={event.id} />
        ))}
    </ul>
) : <Message msg="이벤트가 존재하지 않습니다." />;