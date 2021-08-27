import React from 'react';
import styles from './Sign.module.scss';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import SignComplete from '../../components/sign/SignComplete';
import Button from 'components/button/Button';
import Complete from '../../components/svg/sign/complete.svg';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

const SignCompleteContainer = ({ name }) => {
    //qurey로 이름 값 받아서 출력하기
    const history = useHistory();

    const onClickLogin = () => {
        history.push(Paths.ajoonamu.signin);
    }

    return (
        <div className={cx('container', 'center')}>
            <div className={cx('content', 'pd-none')}>
                <div className={styles['success-img']}>
                    <img src={Complete} alt={"축하합니다"} />
                </div>
                <div className={styles['msg']}> 
                <div className={styles['text']}>축하합니다 {name}님!</div>
                    <div className={styles['sub-text']}>
                    샌달 회원가입이 완료 되었습니다.<br/>
                    이메일 회원가입을 하신 회원님께서는 가입하신 이메일 주소로 지금 즉시 로그인이 가능합니다.</div>
                </div>
                <Button title={"로그인"} onClick={onClickLogin} toggle={true}></Button>
            </div>
        </div>
    )
}

export default SignCompleteContainer;