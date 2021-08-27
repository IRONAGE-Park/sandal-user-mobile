import React, { useState } from 'react';
import { Paths } from 'paths';
import styles from './Recovery.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import Button from 'components/button/Button';
import classNames from 'classnames/bind';
import { useHistory } from 'react-router';
import { findPw } from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import { isEmailForm } from '../../lib/formatChecker';
import AuthPhone from '../../components/sign/AuthPhone';
const cx = classNames.bind(styles);


const RecoveryPwContainer = () => {

    const openModal = useModal();
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [success, setSuccess] = useState(false);

    const onChangeName = (e) => setName(e.target.value);
    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePhone = (e) => setUserPhone(e.target.value);

    const onClickComplete = async () => {
        if (isEmailForm(email)) {
            if (name && userPhone) {
                try {
                    const res = await findPw(email, name, userPhone);
                    if (res.data.msg === '성공') {
                        const find_user = {
                            email,
                            name,
                            hp: userPhone,
                        };
                        sessionStorage.setItem('find_user', JSON.stringify(find_user));
                        history.push(Paths.ajoonamu.find_password);
                    } else {
                        openModal(res.data.msg, '입력하신 정보를 다시 한 번 확인해 주세요.');
                    }
                } catch (e) {
                    openModal('서버에 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
                }
            } else {
                openModal('정보가 부족합니다.', '입력하신 정보를 다시 한 번 확인해 주세요.')
            }
        } else {
            openModal('이메일 형식에 맞지 않습니다!', '이메일을 다시 한 번 확인해 주세요.');
        }
    };

    return (
        <div className={styles['container']}>
            <div className={cx('content', 'pd-box')}>
                <SignNormalInput
                    inputType="text"
                    placeholder={'이름'}
                    initValue={name}
                    onChange={onChangeName}
                />
                <SignNormalInput
                    inputType="email"
                    placeholder={'이메일'}
                    initValue={email}
                    onChange={onChangeEmail}
                />
                <AuthPhone
                    userPhone={userPhone}
                    onChangePhone={onChangePhone}
                    success={success}
                    setSuccess={setSuccess}
                />
                <Button
                    title={'확인'}
                    toggle={success}
                    onClick={onClickComplete}
                />
            </div>
        </div>
    );
};

export default RecoveryPwContainer;
