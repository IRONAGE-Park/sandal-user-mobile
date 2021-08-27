import React from 'react';
import styles from './Message.module.scss';
import propTypes from 'prop-types';
import NoMenu from 'components/svg/menu/nomenu.svg';
import { ButtonBase } from '@material-ui/core';

//맞춤 주문시 보여줄 컴포넌트
const Message = ({ src, msg, onClick, isButton, buttonName }) => {
    return (
        <div className={styles['msg']}>
            {src && (
                <div className={styles['icon']}>
                    <img src={NoMenu} alt={''} />
                </div>
            )}
            <div className={styles['title-msg']}>
                {msg.split('\n').map((line, index) => (<span key={index}>{line}<br/></span>))}
            </div>
            {isButton ? (
                <ButtonBase className={styles['custom-btn']} onClick={onClick}>
                    {buttonName}
                </ButtonBase>
            ) : null}
        </div>
    );
};

Message.propTypes = {
    msg: propTypes.string,
    onClick: propTypes.func,
    isButton: propTypes.bool,
};

Message.defaultProps = {
    src: true,
    msg: '샌달',
    isButton: false,
    onClick: () => {},
};

export default Message;
