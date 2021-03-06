import React, { useState } from 'react';

import FixButton from 'components/button/Button';
import { numberFormat, stringNumberToInt } from '../../lib/formatter';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import { useModal } from '../../hooks/useModal';

import styles from './PointModal.module.scss';

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
    const [point_price, setPointPrice] = useState(0);
    const openModal = useModal();

    const onChangePointPrice = (e) => {
        const value = stringNumberToInt(e.target.value);
        if (isNaN(value)) {
            setPointPrice(0);
        } else {
            setPointPrice(value);
        }
    };

    const onClickOk = () => {
        if (props.user_point < point_price) {
            openModal('???????????? ??????????????? ????????????.', '???????????? ??????????????????');
        }
        else if(point_price> props.total_price){
            openModal('?????? ????????? ??????????????????.','?????? ?????? ????????? 10,000??? ???????????? ?????????.');
        }
        else if(props.total_price -point_price <10000){
            openModal('?????? ????????? ??????????????????.','?????? ?????? ????????? 10,000??? ???????????? ?????????.');
        }
        else {
            if(point_price===0){
                props.onChange(0);
                props.handleClose();
            }
            else if(point_price < 5000) {
            openModal('5,000P ???????????? ?????????????????????.', '???????????? ??????????????????');
            }
            else{
                props.onChange(point_price);
                props.handleClose();
            }
      
        }
    };
    const onClickCancle = () => {
        setPointPrice(0);
        props.handleClose();
    };

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.handleClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        className={classes.close}
                        color="inherit"
                        onClick={onClickCancle}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        ????????? ??????
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                <div className={styles['point']}>
                    <div className={styles['title']}>?????? ?????????</div>
                    <div className={styles['value']}>
                        {props.user_point && numberFormat(props.user_point)}P
                    </div>
                </div>
            </DialogContent>
            <DialogContent className={classes.content}>
                <div className={styles['point-input-box']}>
                    <div className={styles['title']}>????????? ?????????</div>
                    <div className={styles['modal-input-box']}>
                        <input
                            className={styles['point-input']}
                            type="text"
                            value={numberFormat(point_price)}
                            onChange={onChangePointPrice}
                        ></input>
                        <div className={styles['point-img']}>P</div>
                    </div>
                    <div className={styles['sub-title']}>
                        ??? 5,000P ???????????? ?????? ???????????????.
                    </div>
                </div>
            </DialogContent>
            <FixButton title={'??????'} onClick={onClickOk} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
