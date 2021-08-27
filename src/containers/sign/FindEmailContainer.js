import React, { useEffect, useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './Find.module.scss';
import { ButtonBase } from '@material-ui/core';
import { useModal } from '../../hooks/useModal';

const FindEmailContainer = () => {
    const history = useHistory();
    const openModal = useModal();
    const [fine_email, setEmail] = useState('');

    const onClickLogin = () => {
        history.push(Paths.ajoonamu.signin);
    };
    const onClickFindPw = () => {
        history.push(Paths.ajoonamu.recovery_pw);
    };
    useEffect(() => {
        const find_user = JSON.parse(sessionStorage.getItem('find_user'));
        if (find_user) {
            const { email } = find_user;
            setEmail(email);
        } else {
            openModal('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
            history.replace(Paths.ajoonamu.signin)
        }
        return () => {
            sessionStorage.removeItem('find_user');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['text']}>
                        고객님의 정보와 일치하는 아이디 입니다.
                    </div>
                    <div className={styles['user']}>{fine_email}</div>
                </div>
                <div className={styles['btn-box']}>
                    <ButtonBase
                        className={styles['btn']}
                        onClick={onClickLogin}
                    >
                        로그인
                    </ButtonBase>
                    <ButtonBase
                        className={styles['btn']}
                        onClick={onClickFindPw}
                    >
                        비밀번호찾기
                    </ButtonBase>
                </div>
            </div>
        </>
    );
};
export default FindEmailContainer;
