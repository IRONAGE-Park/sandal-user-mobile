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
            openModal('보유하신 포인트보다 많습니다.', '포인트를 확인해주세요');
        }
        else if(point_price> props.total_price){
            openModal('주문 금액을 확인해주세요.','최소 결제 금액은 10,000원 이상부터 입니다.');
        }
        else if(props.total_price -point_price <10000){
            openModal('주문 금액을 확인해주세요.','최소 결제 금액은 10,000원 이상부터 입니다.');
        }
        else {
            if(point_price===0){
                props.onChange(0);
                props.handleClose();
            }
            else if(point_price < 5000) {
            openModal('5,000P 이상부터 사용가능합니다.', '포인트를 확인해주세요');
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
                        포인트 사용
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                <div className={styles['point']}>
                    <div className={styles['title']}>보유 포인트</div>
                    <div className={styles['value']}>
                        {props.user_point && numberFormat(props.user_point)}P
                    </div>
                </div>
            </DialogContent>
            <DialogContent className={classes.content}>
                <div className={styles['point-input-box']}>
                    <div className={styles['title']}>사용할 포인트</div>
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
                        ※ 5,000P 이상부터 사용 가능합니다.
                    </div>
                </div>
            </DialogContent>
            <FixButton title={'확인'} onClick={onClickOk} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
