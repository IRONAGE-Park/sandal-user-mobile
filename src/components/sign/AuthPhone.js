import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { requestPostMobileAuth, requestPostMobileAuthCheck } from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import { isCellPhoneForm } from '../../lib/formatChecker';

import styles from './AuthPhone.module.scss';

import SignAuthInput from './SignAuthInput';
import SignNormalInput from './SignNormalInput';
import AuthTimer from './AuthTimer';
import Toast from '../message/Toast';
import Check from '../svg/sign/Check';

const cx = classNames.bind(styles);

const AUTH_NUMBER_LENGTH = 6;

export default ({ userPhone, onChangePhone, success, setSuccess }) => {

    const authInputRef = useRef(null);

    const [toggle, setToggle] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [start_timer, setStartTimer] = useState(false);
    const [userAuth, setUserAuth] = useState('');
    const onChangeAuth = e => setUserAuth(e.target.value);
    const openModal = useModal();

    const onClickCompareAuth = useCallback(async () => {
        if (userAuth.length === AUTH_NUMBER_LENGTH) {
            try {
                const res = await requestPostMobileAuthCheck(userPhone, userAuth);
                if (res.data.msg === '성공!') {
                    openModal('성공적으로 인증되었습니다!', '절차를 계속 진행해 주세요.');
                    setSuccess(true);
                    setStartTimer(false);
                } else {
                    setToast(true);
                    setToastMessage('인증번호가 틀렸습니다!', () => authInputRef.current.focus());
                    setTimeout(() => {
                        setToast(false);
                    }, 3000);
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            }
            setUserAuth('');
        }
    }, [userAuth, userPhone, openModal, setSuccess]);

    //인증번호 발송 버튼
    const onClickSendAuth = async () => {
        if (isCellPhoneForm(userPhone)) {
            try {
                const res = await requestPostMobileAuth(userPhone);
                if (res.data.msg === '실패!') {
                    setToast(true);
                    setToastMessage('SMS not enough point. please charge.');
                    setTimeout(() => {
                        setToast(false);
                    }, 3000);
                } else {
                    setToggle(true);
                    setStartTimer(true);
                    openModal('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!', () => authInputRef.current.focus());
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            }
        } else {
            setToast(true);
            setToastMessage('휴대폰 번호 형식에 맞지 않습니다!');
            setTimeout(() => {
                setToast(false);
            }, 3000);
        }
    };

    const onClickReSendAuth = () => {
        openModal(
            '인증번호를 재전송 하시겠습니까?',
            '인증번호는 6자리입니다.',
            () => {
                setStartTimer(false);
                onClickSendAuth();
                authInputRef.current.focus();
            },
            () => {},
            true,
        );
    };

    useEffect(() => {
        onClickCompareAuth();
    }, [onClickCompareAuth]);
    
    return (
        <>
            <SignAuthInput
                inputType={'tel'}
                onClick={success ? () => {} : toggle ? onClickReSendAuth : onClickSendAuth}
                toggle={toggle}
                initValue={userPhone}
                buttonTitle={
                    success ? '인증 완료' : toggle ? '인증번호 재발송' : '인증번호 발송'
                }
                onChange={onChangePhone}
                placeholder={'휴대폰 번호'}
                button_disabled={success}
                input_disabled={success}
            />
            <div className={cx('auth-btn', { not_view: !toggle })}>
                <SignNormalInput
                    inputType={'number'}
                    initValue={userAuth}
                    onChange={onChangeAuth}
                    reference={authInputRef}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            onClickCompareAuth();
                        }
                    }}
                />
                <div className={styles['timer']}>
                    {success ? <Check on={true}/>
                    : start_timer && <AuthTimer start={start_timer} setStart={setStartTimer} />}
                </div>
            </div>
            <Toast on={toast} msg={toastMessage} />
        </>
    )
}