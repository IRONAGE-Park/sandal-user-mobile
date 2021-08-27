import React from 'react';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import styles from './TitleBar.module.scss';
import Back from 'components/svg/header/goBack';
import { IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';

const cn = classnames.bind(styles);

const TitleBar = ({ title, children, isHome }) => {
    const { header } = useSelector(state => state.scroll);

    return (
        <>
            {title &&
                <div className={cn('title-bar', { not_view: header })}>
                    <div className={styles['item']}>
                        <BackButton isHome={isHome} />
                        <Title title={title} />
                        <div className={styles['empty']}>{children}</div>
                    </div>
                </div>
            }
        </>
    );
};

const Title = ({ title }) => {
    return (
        <div className={styles['title']}>
            {title}
        </div>
    );
};

const BackButton = ({ isHome }) => {
    const history = useHistory();
    const onClickBack = () => {
        isHome ? history.push('/') : history.goBack();
    };
    return (
        <div className={styles['back']}>
            <div className={styles['pd-box']}>
                <IconButton
                    onClick={onClickBack}
                    className={styles['back-button']}
                >
                    <Back />
                </IconButton>
            </div>
        </div>
    );
};

TitleBar.defaultProps = {
    sub: false,
    isHome: false,
    onClick: () => {},
};

export default TitleBar;
