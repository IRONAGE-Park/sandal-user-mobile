import React, { useEffect, useState, useCallback } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

//styles
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
//components

import Button from '@material-ui/core/Button';
import DropoutModal from '../../components/modal/DropoutModal';
import ProfileModal from '../../components/modal/ProfileModal';
//lib
import { DBImageFormat, stringToTel } from '../../lib/formatter';
import Back from '../../components/svg/header/Back';

//hooks
import { useInit } from '../../hooks/useStore';
import { useStore } from '../../hooks/useStore';

//api
import { noAuthGetNearStore } from '../../api/noAuth/store';
import { localLogout, requestAgreeChange, updateProfileImage } from '../../api/auth/auth';

//store
import { get_user_info, logout } from '../../store/auth/auth';
import { update_user_info } from '../../store/auth/auth';
import { useModal } from '../../hooks/useModal';
import ProfileCoverImage from '../../components/asset/ProfileCoverImage';
import { ButtonBase } from '@material-ui/core';

const cn = classNames.bind(styles);

const AccountContainer = ({ modal }) => {    

    const initStore = useInit();
    const { user } = useSelector(state => state.auth);
    const user_token = useStore(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const openModal = useModal();
    const onOpenDropoutModal = () => history.push(Paths.ajoonamu.account + '/dropout');
    const onOpenProfileModal = () => history.push(Paths.ajoonamu.account + '/profile');
    const onCloseModal = () => history.goBack();
    const onClickUpdateName = () => history.push(Paths.ajoonamu.update_name);
    const onClickUpdatePhone = () => history.push(Paths.ajoonamu.update_phone);
    const onClickUpdatePassword = () => history.push(Paths.ajoonamu.update_password);
    
    const onChangeFiles = useCallback(async (e) => {
        if (e.target.files.length) {
            try {
                const res = await updateProfileImage(user_token, e.target.files[0]);
                if (res.data.msg === "??????") {
                    openModal('????????? ???????????? ?????????????????????!');
                    dispatch(get_user_info(user_token));
                } else {
                    openModal('????????? ????????? ????????? ?????????????????????!', '????????? ?????? ????????? ?????????.');
                }
            } catch (e) {
                openModal('????????? ????????? ?????????????????????!', '????????? ?????? ????????? ?????????.');
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user_token]);

    const onClickLogout = useCallback(async () => {
        openModal('?????? ???????????? ???????????????????', '', async () => {
            try {
                const res = await localLogout(user_token);
                localStorage.removeItem('access_token');
                if (res.message === '??????????????? ?????????????????????.') {
                    dispatch(logout());
                    initStore();
                    const noAuthAddrs = JSON.parse(
                        localStorage.getItem('noAuthAddrs'),
                    );
                    if (noAuthAddrs) {
                        const index = noAuthAddrs.findIndex(
                            (item) => item.active === 1,
                        );
                        if (index !== -1) {
                            const {
                                addr1,
                                addr2,
                                lat,
                                lng,
                                post_num,
                            } = noAuthAddrs[index];
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
                        }
                    }
                    history.replace(Paths.index);
                }
            } catch (e) {
                console.error(e);
            }
        }, () => {}, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, history, initStore, user_token]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const render = () => (
        <>
            <div className={styles['container']}>
                <div className={styles['user-info']}>
                    <div className={cn('profile')} onClick={onOpenProfileModal}>
                        <ProfileCoverImage src={DBImageFormat(user && user.profile_img)} alt="" />
                    </div>
                    
                        <ButtonBase component="label" htmlFor="change_profile" onClick={e => e.stopPropagation()} className={styles['change']}>??????</ButtonBase>
                        <input type="file" id="change_profile" className={styles['change-profile']} onChange={onChangeFiles} accept="image/gif, image/jpeg, image/png, image/svg" />
                </div>
                <div className={styles['tab']}>
                    <Item text={'??????'} value={user && user.name} onClick={onClickUpdateName}/>
                    <Item text={'????????? ??????'} value={user && user.hp && stringToTel(user.hp)}  onClick={onClickUpdatePhone}/>
                    <Item text={'?????????'} value={user && user.email} />
                    <Item text={'???????????? ??????'} onClick={onClickUpdatePassword}/>
                </div>

                <MarketingAgree
                    agreeMail={user.agree_mail}
                    agreeSMS={user.agree_sms}
                />
                <div className={styles['logout']} >
                    <Button className={styles['logout-btn']} onClick={onClickLogout}>
                        <div className={styles['pd-btn']}>????????????</div>
                    </Button>
                </div>
                <div className={styles['drop-out']}>
                    <div className={styles['text']} onClick={onOpenDropoutModal}>
                        ????????????
                    </div>
                    <p>???????????? ?????????????????? ???????????????.</p>
                </div>
            </div>
            <ProfileModal open={modal === 'profile'} src={DBImageFormat(user && user.profile_img)} handleClose={onCloseModal} />
            <DropoutModal open={modal === 'dropout'} handleClose={onCloseModal}/>
        </>
    );
    return <>{user === null ? ()=>{} : render()}</>;
};

const MarketingAgree = ({ agreeMail, agreeSMS }) => {
    const [mail, setMail] = useState(agreeMail);
    const [sms, setSMS] = useState(agreeSMS);
    const dispatch = useDispatch();
    const user_token = useStore();

    const sendPostAgreeChange = useCallback(async (type, value) => {
        /*
            ?????? ?????? ????????????.
            type??? value??? ??? ??????.
        */
        await requestAgreeChange(user_token, type, value);
    }, [user_token]);

    const changeMail = useCallback(() => {
        sendPostAgreeChange('mail', !mail);
        setMail(!mail);
        dispatch(update_user_info({name :'agree_mail' ,value: !mail}));
    }, [mail, sendPostAgreeChange,dispatch]);
    const changeSMS = useCallback(() => {
        sendPostAgreeChange('sms', !sms);
        setSMS(!sms);
        dispatch(update_user_info({name :'agree_sms' ,value: !sms}));
    }, [sms, sendPostAgreeChange,dispatch]);

    return (
        <div className={styles['marketing']}>
            <div className={styles['head']}>
                <h3 className={styles['title']}>????????? ?????? ?????? ??????</h3>
                <p className={styles['sub-title']}>
                    ????????? ??? ?????? ????????? ?????? ????????? ????????? ??? ????????????.
                </p>
            </div>
            <div className={styles['selector-box']}>
                <AgreeToggle
                    name="?????? ?????? ??????"
                    checked={mail}
                    onToggle={changeMail}
                />
                <AgreeToggle
                    name="SMS ?????? ??????"
                    checked={sms}
                    onToggle={changeSMS}
                />
            </div>
        </div>
    );
};

const AgreeToggle = ({ name, checked, onToggle }) => {
    return (
        <div className={styles['selector']}>
            <div className={styles['name']}>{name}</div>
            <div className={cn('toggle', { checked })} onClick={onToggle}>
                <div className={styles['box']}>
                    <div className={styles['switch']}></div>
                </div>
            </div>
        </div>
    );
};

const Item = ({ text, value, onClick }) => (
    <Button className={styles['pd-box']} onClick={onClick}>
        <div className={styles['item']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>
                {value}
                {onClick &&  <Back rotate="180deg" width={18} height={18} />}
            </div>
        </div>
    </Button>
);

export default AccountContainer;
