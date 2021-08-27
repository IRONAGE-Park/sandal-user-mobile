import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Paths } from 'paths';
import FixButton from 'components/button/Button';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CircleCheckBox from '../checkbox/CircleCheckBox';

import styles from './Dropout.module.scss';

//api
import { requestPutSecession } from '../../api/auth/auth';
import { noAuthGetNearStore } from '../../api/noAuth/store';

//hooks
import { useModal } from '../../hooks/useModal';
import { useStore, useInit } from '../../hooks/useStore';

//store

import { logout } from '../../store/auth/auth';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingBottom: '60px',
    },
    appBar: {
        position: 'relative',
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        borderBottom: 'solid 1px #aaa',
        fontSize: 10,
    },
    title: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16,
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 0,
        paddingLeft: 24,
        paddingRight: 24,
        flex: '0 0 auto',
    },
    sub: {
        fontSize: 10,
    },
    close: {
        position: 'absolute',
        width: '40px', height: '40px',
        left: 14,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = (props) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const token = useStore(false);
    const initStore = useInit();
    const history = useHistory();
    const [agree, setAgree] = useState(false);
    const openModal = useModal();

    const onChangeAgree = e => setAgree(e.target.checked);

    const onSecession = useCallback(() => {
        if (agree) {
            openModal(
                '정말로 탈퇴하시겠습니까?',
                '',
                async () => {
                    try {
                        const res = await requestPutSecession(token, agree);
                        if (res.data.msg) {
                            openModal(
                                '정상적으로 회원탈퇴 되셨습니다!',
                                '다음에도 저희 샌달을 이용해 주시기 바랍니다.',
                            );
                            history.push(Paths.ajoonamu.logout);
                            localStorage.removeItem('access_token');
                            dispatch(logout());
                            initStore();
                            //회원 탈퇴후 비회원정보가 있을시 정보 받아오기
                            const noAuthAddrs = JSON.parse(
                                localStorage.getItem('noAuthAddrs'),
                            );
                            if (noAuthAddrs) {
                                const index = noAuthAddrs.findIndex(
                                    (item) => item.active === 1,
                                );
                                if (index !== -1) {
                                    const {
                                        addr1,
                                        addr2,
                                        lat,
                                        lng,
                                        post_num,
                                    } = noAuthAddrs[index];
                                    const near_store = await noAuthGetNearStore(
                                        lat,
                                        lng,
                                        addr1,
                                    );
                                    initStore(
                                        addr1,
                                        addr2,
                                        lat,
                                        lng,
                                        post_num,
                                        near_store.data.query,
                                    );
                                }
                            }
                            history.replace(Paths.index);
                        }
                    } catch (e) {
                        openModal(
                            '잘못된 접근입니다.',
                            '잠시 후 재시도 해주세요.',
                        );
                    }
                },
                ()=>{},
                true,
            );
        } else {
            openModal(
                '확인 요소에 동의하셔야 합니다.',
                '위 글을 읽고 다시 신청해 주세요.',
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, agree, openModal, history]);

    return (
        <div>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.handleClose}
                TransitionComponent={Transition}
                className={classes.container}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            className={classes.close}
                            color="inherit"
                            onClick={props.handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            회원 탈퇴
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={styles['container']}>
                    <div className={styles['content']}>
                        <p>회원 탈퇴를 신청하기 전에 먼저 확인해 주세요.</p>
                    </div>
                    <div className={styles['content']}>
                        <div className={styles['explan']}>
                            <p>
                                탈퇴 후 회원정보 및 이용기록은 모두 삭제되며
                                다시 복구가 불가 합니다.
                            </p>
                            <br />
                            <p>
                                주문내역 및 결제 내용은 이용약관과 관련법에
                                의하여 보관됩니다.
                            </p>
                            <br />
                            <p>
                                동일한 SNS계정과 이메일을 사용한 재가입은
                                24시간이내에 불가합니다.
                            </p>
                            <br />
                        </div>
                    </div>
                    <div className={styles['line']} />
                    <div className={styles['content']}>
                        <div className={styles['agree']}>
                            <p>회원탈퇴를 신청하시겠습니까?</p>
                            <CircleCheckBox
                                id={'agree'}
                                text={'예, 탈퇴를 신청합니다.'}
                                check={agree}
                                onChange={onChangeAgree}
                            />
                        </div>
                    </div>
                </div>
                <FixButton
                    title={'탈퇴하기'}
                    onClick={agree ? onSecession : () => {}}
                    toggle={agree}
                />
            </Dialog>
        </div>
    );
};

export default FullScreenDialog;
