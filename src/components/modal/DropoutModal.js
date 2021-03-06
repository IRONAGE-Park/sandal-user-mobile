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
                '????????? ?????????????????????????',
                '',
                async () => {
                    try {
                        const res = await requestPutSecession(token, agree);
                        if (res.data.msg) {
                            openModal(
                                '??????????????? ???????????? ???????????????!',
                                '???????????? ?????? ????????? ????????? ????????? ????????????.',
                            );
                            history.push(Paths.ajoonamu.logout);
                            localStorage.removeItem('access_token');
                            dispatch(logout());
                            initStore();
                            //?????? ????????? ?????????????????? ????????? ?????? ????????????
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
                            '????????? ???????????????.',
                            '?????? ??? ????????? ????????????.',
                        );
                    }
                },
                ()=>{},
                true,
            );
        } else {
            openModal(
                '?????? ????????? ??????????????? ?????????.',
                '??? ?????? ?????? ?????? ????????? ?????????.',
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
                            ?????? ??????
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={styles['container']}>
                    <div className={styles['content']}>
                        <p>?????? ????????? ???????????? ?????? ?????? ????????? ?????????.</p>
                    </div>
                    <div className={styles['content']}>
                        <div className={styles['explan']}>
                            <p>
                                ?????? ??? ???????????? ??? ??????????????? ?????? ????????????
                                ?????? ????????? ?????? ?????????.
                            </p>
                            <br />
                            <p>
                                ???????????? ??? ?????? ????????? ??????????????? ????????????
                                ????????? ???????????????.
                            </p>
                            <br />
                            <p>
                                ????????? SNS????????? ???????????? ????????? ????????????
                                24??????????????? ???????????????.
                            </p>
                            <br />
                        </div>
                    </div>
                    <div className={styles['line']} />
                    <div className={styles['content']}>
                        <div className={styles['agree']}>
                            <p>??????????????? ?????????????????????????</p>
                            <CircleCheckBox
                                id={'agree'}
                                text={'???, ????????? ???????????????.'}
                                check={agree}
                                onChange={onChangeAgree}
                            />
                        </div>
                    </div>
                </div>
                <FixButton
                    title={'????????????'}
                    onClick={agree ? onSecession : () => {}}
                    toggle={agree}
                />
            </Dialog>
        </div>
    );
};

export default FullScreenDialog;
