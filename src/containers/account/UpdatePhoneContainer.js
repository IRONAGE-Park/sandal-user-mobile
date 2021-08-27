import React, { useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './UpdateInfo.module.scss';
import Button from 'components/button/Button';
import { updatePhone } from '../../api/auth/auth';
import { update_user_info } from '../../store/auth/auth';
import { useStore } from '../../hooks/useStore';
import AuthPhone from '../../components/sign/AuthPhone';
import { useModal } from '../../hooks/useModal';


const UpdatePhoneContainer = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const openModal = useModal();

    const user_token = useStore();
    const [phone, setPhone] = useState('');
    const onChangePhone = (e) => setPhone(e.target.value);
    const [success, setSuccess] = useState(false);
    //인증번호 발송

    const onClickUpdatePhone = async () => {
        try {
            const res = await updatePhone(user_token, phone);
            dispatch(update_user_info({ name: 'hp', value: phone }));
            if (res.data.msg === '성공') {
                openModal('성공적으로 변경되었습니다!', '변경된 정보를 기억해 주세요.');
                history.replace(Paths.ajoonamu.account);
            } else {
                openModal('서버에 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        } catch (e) {
            openModal('서버에 오류가 발생했습니다.', '잠시 후 재시도 해주세요.');
        }
    };
    
    return (
        <>
            <div className={styles['container']}>
                <div className={styles['context']}>
                    <div className={styles['input']}>
                        <AuthPhone
                            userPhone={phone}
                            onChangePhone={onChangePhone}
                            success={success}
                            setSuccess={setSuccess}
                        />
                    </div>
                </div>
            </div>
            <Button title={'확인'} toggle={success} onClick={onClickUpdatePhone}/>
        </>
    );
};

export default UpdatePhoneContainer;