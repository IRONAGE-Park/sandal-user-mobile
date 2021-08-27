import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './UpdateInfo.module.scss';
import Button from 'components/button/Button';
import SignNormalInput from 'components/sign/SignNormalInput';
import classNames from 'classnames/bind';
import { updatePassword } from '../../api/auth/auth';
import { useStore } from '../../hooks/useStore';
import { Paths } from '../../paths';
import { useModal } from '../../hooks/useModal';
import { isPasswordForm } from '../../lib/formatChecker';
const cx = classNames.bind(styles);

const UpdatePasswordContainer = () => {
    const history = useHistory();
    const openModal = useModal();
    const [password, setPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [new_password_confirm, setNewPasswordConfirm] = useState('');
    const [compare, setCompare] = useState(false);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeNewPassword = (e) => setNewPassword(e.target.value);
    const onChangeNewPasswordConfirm = (e) =>
        setNewPasswordConfirm(e.target.value);
    const user_token = useStore();

    const passwordInputRef = useRef(null);
    const newPasswordInputRef = useRef(null);

    //패스워드 매칭 체크
    const matchPassword = useCallback(() => {
        if (new_password.length !== 0 && new_password_confirm.length !== 0) {
            setCompare(new_password === new_password_confirm);
        } else {
            setCompare(false);
        }
    }, [new_password, new_password_confirm]);

    const confirm = () => {
        if (new_password.length !== 0 || new_password_confirm.length !== 0) {
            if (compare) {
                return '비밀번호가 일치합니다.';
            } else {
                return '비밀번호가 일치하지 않습니다.';
            }
        }
    };

    const onClickUpdatePassword = async () => {
        if (isPasswordForm(new_password)) {
            try {
                const res = await updatePassword(
                    user_token,
                    password,
                    new_password,
                    new_password_confirm,
                );
                if (res.data.msg === '성공') {
                    openModal(
                        '성공적으로 변경되었습니다!',
                        '변경된 정보를 기억해 주세요.',
                    );
                    history.replace(Paths.ajoonamu.account);
                } else {
                    openModal(
                        '서버에 오류가 발생했습니다.',
                        '잠시 후 다시 시도해 주세요.',
                    );
                }
            } catch (e) {
                openModal(
                    '기존 비밀번호가 틀렸습니다',
                    '기존 비밀번호를 다시 한 번 확인해 주세요.',
                    () => passwordInputRef.current.focus()
                );
            }
        } else {
            openModal("비밀번호 형식에 맞지 않습니다!", '8자 이상으로 문자, 숫자 및 특수문자가 모두 포함되어야 합니다.', () => newPasswordInputRef.current.focus());
        }
    };

    useEffect(() => {
        matchPassword();
    }, [matchPassword]);

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['context']}>
                    <div className={styles['input']}>
                        <div className={styles['box']}>
                            <SignNormalInput
                                inputType={'password'}
                                initValue={password}
                                onChange={onChangePassword}
                                placeholder={'현재 비밀번호'}
                                reference={passwordInputRef}
                            />
                        </div>
                        <div>
                            <SignNormalInput
                                inputType={'password'}
                                initValue={new_password}
                                onChange={onChangeNewPassword}
                                placeholder={'변경할 비밀번호'}
                                reference={newPasswordInputRef}
                            />
                            <SignNormalInput
                                inputType={'password'}
                                initValue={new_password_confirm}
                                onChange={onChangeNewPasswordConfirm}
                                placeholder={'변경할 비밀번호 확인'}
                            />
                            <div
                                className={cx('compare', {
                                    on: compare,
                                    not_view:
                                        new_password.length === 0 ||
                                        new_password_confirm.length === 0,
                                })}
                            >
                                <label>{confirm()}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                title={'확인'}
                toggle={compare}
                onClick={onClickUpdatePassword}
            />
        </>
    );
};

export default UpdatePasswordContainer;
