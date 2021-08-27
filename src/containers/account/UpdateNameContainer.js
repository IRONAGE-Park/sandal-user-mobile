import React, { useState } from 'react';
import { Paths } from 'paths';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateName } from '../../api/auth/auth';
import { update_user_info } from '../../store/auth/auth';

import styles from './UpdateInfo.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import Button from 'components/button/Button';
import CloseButton from 'components/svg/account/Close';

//hooks
import { useModal } from '../../hooks/useModal';
import { useStore } from '../../hooks/useStore';


const UpdateNameContainer=()=>{
    const history = useHistory();
    const openModal = useModal();
    const user_token = useStore();
    const [newName, setNewName] = useState('');

    const onChageNewName = (e) => setNewName(e.target.value);
    const dispatch = useDispatch();

    const onClickUpdateName = async () => {
        try {
            const res = await updateName(user_token, newName);
            dispatch(update_user_info({ name: 'name', value: newName }));
            if (res.data.msg === '성공') {
                openModal('성공적으로 변경되었습니다!', '변경된 정보를 기억해 주세요.');
                history.replace(Paths.ajoonamu.account);
            } else {
                openModal('서버에 오류가 발생했습니다.', '잠시 후 다시 시도해 주세요.');
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
        }
    };
    const onClickClear = () => {
        setNewName('');
    };

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['context']}>
                    <div className={styles['input']}>
                        <SignNormalInput
                            initValue={newName}
                            onChange={onChageNewName}
                        />

                        <div className={styles['close']} onClick={onClickClear}>
                            <CloseButton />
                        </div>
                    </div>
                </div>
            </div>
            <Button
                title={'확인'}
                toggle={newName.length > 0}
                onClick={newName.length > 0 && onClickUpdateName}
            />
        </>
    );
}

export default UpdateNameContainer;