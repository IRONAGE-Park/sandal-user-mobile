import React from 'react';
import { useSelector } from 'react-redux';
import { Paths } from 'paths';
import styles from './Title.module.scss';
import { useHistory } from 'react-router';
import cn from 'classnames/bind';
import locationImage from '../svg/title-bar/location.svg';
import notificationBellImage from '../svg/title-bar/notification-bell.svg';

const cx = cn.bind(styles);

// 헤더 밑 서브 헤더 컴포넌트
// 헤더 폴더로 이동시켜야할지 말지 고민중

const Title = () => {
    const { addr1 } = useSelector(state => state.address);
    const { notice_check, notification } = useSelector((state) => state.notice);
    const history = useHistory();
    const { header } = useSelector(state => state.scroll);
    
    /* 
        사용자가 마지막으로 선택한 배달지를 
        addr로 받아와 렌더.
        useSelect로 전역 state로 받아와도 됨
    */
    const onClickAddr = () => history.push(Paths.ajoonamu.address);
    const onClickMap = () => history.push(Paths.ajoonamu.address + '/map');
    const onClickNotice = () => history.push(Paths.ajoonamu.notice);

    return (
        <div className={cx('app-title', { not_view: header })}>
            <div className={styles['app-title-main']}>
                <div className={styles['app-title-content']}>
                    <div className={cx('notice')}>
                        <div
                            className={cx('app-title-notification', {
                                unread:
                                    !notice_check && notification.length !== 0,
                            })}
                            onClick={onClickNotice}
                        >
                            <img
                                src={notificationBellImage}
                                alt="notification-bell"
                            />
                        </div>
                    </div>
                    <div className={styles['app-title-location']} onClick={onClickAddr}>
                        {addr1 ? addr1 : '배달지를 설정해주세요'}
                    </div>
                    <div className={styles['app-title-location-button']}>
                        <img src={locationImage} alt="location"
                            onClick={onClickMap}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Title;
