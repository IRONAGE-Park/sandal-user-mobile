import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import { requestQNADelete, requestQNADetail } from '../../api/support/qna';
import Loading from '../asset/Loading';
import { ButtonBase } from '@material-ui/core';

import styles from './QNADetailModal.module.scss';
import { useModal } from '../../hooks/useModal';
import { dateToYYYYMMDD } from '../../lib/formatter';
import { Paths } from '../../paths';
import { useHistory } from 'react-router-dom';
const cn = classnames.bind(styles);

const useStyles = makeStyles(() => ({
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
        padding: '0',
        paddingBottom: '60px',
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

const FullScreenDialog = ({ USER_TOKEN, viewId, handleClose, onRemove }) => {
    const classes = useStyles();

    const history = useHistory();

    const openModal = useModal();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const { subject, question, answer, q_datetime, a_datetime, status } = data;

    const callGetDetail = useCallback(async () => {
        if (viewId !== -1) {
            setLoading(true);
            try  {
                const res = await requestQNADetail(USER_TOKEN, viewId);
                if (res.data.query !== null) {
                    setData(res.data.query);
                }
            } catch (e) {
                openModal('????????? ????????? ??????????????????.', '????????? ????????? ????????? ?????????.');
            }
            setLoading(false);
        }
    }, [USER_TOKEN, viewId, openModal]);

    const callDeleteDetail = useCallback(() => {
        if (viewId !== -1) {
            openModal('?????? ????????? ?????????????????????????', '', async () => {
                setLoading(true);
                try {
                    const res = await requestQNADelete(USER_TOKEN, viewId);
                    if (res.data.msg === '??????') {
                        openModal('??????????????? ????????? ?????????????????????!', '');
                        onRemove(viewId);
                        history.replace(Paths.ajoonamu.mypage);
                    } else {
                        openModal('????????? ??????????????????.', '?????? ??????????????????.');
                    }
                } catch (e) {
                    openModal('????????? ???????????????', '??????????????? ?????? ????????? ?????????.');
                }
                setLoading(false);
            }, () => {}, true);
        }
    }, [USER_TOKEN, onRemove, openModal, viewId, history]);

    const onClickUpdateForm = useCallback(() => {
        if (viewId !== -1) {
            openModal('?????? ????????? ?????????????????????????', '', () => {
                window.location = Paths.ajoonamu.support + '/qna/send?id=' + viewId;
            }, () => {}, true);
        }
    }, [viewId, openModal]);

    useEffect(() => {
        callGetDetail()
    }, [callGetDetail])

    return (
        <Dialog
            fullScreen
            open={viewId !== undefined}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        className={classes.close}
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        ?????? ?????? ?????? ??????
                    </Typography>
                </Toolbar>
            </AppBar>
            {!loading && <DialogContent className={classes.content}>
                <div className={styles['content']}>
                    <div className={styles['title']}>
                        <h3 className={styles['subject']}>{subject}</h3>
                        <div className={styles['sub']}>
                            <div className={cn('tag', { complete: status !== 0 })}>{status ? '?????? ??????': '?????? ??????'}</div>
                            <div className={styles['q_time']}>{dateToYYYYMMDD(q_datetime, '/')}</div>
                        </div>
                    </div>
                    <div className={styles['question']}>
                        {question}
                    </div>
                    <div className={styles['area']}>
                        {answer && <div className={styles['answer']}>
                            <div className={styles['a_time']}>?????? ??????: {dateToYYYYMMDD(a_datetime, '/')}</div>
                            <p className={styles['text']} dangerouslySetInnerHTML={{ __html: answer}} />
                        </div>}
                    </div>
                </div>
            </DialogContent>}
            <div className={styles['interaction']}>
                <ButtonBase onClick={callDeleteDetail} className={cn('button', 'delete')}>??????</ButtonBase>
                <ButtonBase onClick={onClickUpdateForm} className={cn('button', 'update')}>??????</ButtonBase>
            </div>
            <Loading open={loading} />
        </Dialog>
    );
};

export default FullScreenDialog;
