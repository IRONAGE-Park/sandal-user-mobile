import React, { useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './Recovery.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import Button from 'components/button/Button';
import classNames from 'classnames/bind';
import { findId } from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import AuthPhone from '../../components/sign/AuthPhone';
const cx = classNames.bind(styles);


const RecoveryIdContainer = () => {
    const history = useHistory();
    const openModal = useModal();
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [success, setSuccess] = useState(false);

    const onChangeName = (e) => setUserName(e.target.value);
    const onChangePhone = (e) => setUserPhone(e.target.value);

    const onClickFindEmail = async () => {
        if (userName && userPhone) {
            try {
                const res = await findId(userName, userPhone);
                if (res.data.msg === '성공') {
                    const mail = res.data.query.user.email;
                    const find_user = {
                        email: mail
                    }
                    sessionStorage.setItem('find_user', JSON.stringify(find_user));
                    history.push(Paths.ajoonamu.find_email);
                } else {
                    openModal(res.data.msg, '입력하신 정보를 다시 한 번 확인해 주세요.');
                }
            } catch (e) {
                openModal('서버에 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        } else {
            openModal('정보가 부족합니다.', '입력하신 정보를 다시 한 번 확인해 주세요.')
        }
    };

    return (
        <div className={styles['container']}>
            <div className={cx('content', 'pd-box')}>
                <SignNormalInput
                    inputType={'text'}
                    initValue={userName}
                    onChange={onChangeName}
                    placeholder={'이름'}
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
                    onClick={onClickFindEmail}
                />
            </div>
        </div>
    );
};

export default RecoveryIdContainer;
