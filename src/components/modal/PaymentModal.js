import React,{useEffect} from 'react';
import classNames from 'classnames/bind';

import FixButton from 'components/button/Button';
import Check from 'components/svg/sign/Check';

import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import styles from './PaymentModal.module.scss';

const cx = classNames.bind(styles);

const useStyles = makeStyles((theme) => ({
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
    const [payment, setPayment] = React.useState(props.payment);

    const onClickPayment = value => setPayment(value);
    const onClickClose = () => {
        setPayment(props.payment);
        props.handleClose();
    };

    const list = props.payments.map((p) => (
        <PaymentItem
            id={p.payment}
            key={p.payment}
            on={payment === p.payment}
            onClick={onClickPayment}
        />
    ));

    useEffect(()=>{
        setPayment(props.payment);
    },[props])

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.close} color="inherit" onClick={onClickClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        결제 방법 선택
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['title']}>결제 방법을 선택해주세요.</div>
            <div className={styles['container']}>{list}</div>
            <FixButton title={'확인'} onClick={() => props.onClick(payment)} toggle={true} />
        </Dialog>
    );
};

const PaymentItem = ({ id, on, onClick }) => (
    <ButtonBase className={cx('payment-box', { on: on })} onClick={() => onClick(id)}>
        <div className={styles['text']}>{id}</div>
        <div className={styles['check']}>
            <Check on={on} />
        </div>
    </ButtonBase>
);

export default FullScreenDialog;
