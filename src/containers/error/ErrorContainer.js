import React from 'react';
import styles from './Error.module.scss';
import TitleBar from 'components/titlebar/TitleBar';
import Button from 'components/button/Button';
import ErrorImg from 'components/svg/error/error.svg';
import { useHistory } from 'react-router-dom';

export default function ErrorContainer() {
    const history = useHistory();
    const onClick = () => {
        history.goBack();
    };

    return (
        <>
            <TitleBar title={'오류안내'} />
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>Error : 404</div>
                    <div className={styles['img']}>
                        <img src={ErrorImg} alt={'404'}></img>
                    </div>
                    <div className={styles['text']}>
                        {/* 일시적인 서버 통신 오류 입니다.<br/> 
                        빠르게 복구 하도록하겠습니다.<br/>
                         불편을 드려 죄송합니다.<br/> */}
                        페이지를 찾을 수 없습니다.
                    </div>
                </div>
            </div>
            <Button title={'이전 페이지'} toggle={true} onClick={onClick} />
        </>
    );
}
