import React ,{useState, useCallback, useEffect}from 'react';
import FixButton from 'components/button/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import Plus from '../svg/counter/cross.svg';
import Minus from '../svg/counter/line.svg';
import { numberFormat,stringNumberToInt } from '../../lib/formatter';

import styles from './PreferModal.module.scss';

//test commit
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

    const [budget, setBudget] = useState(0);
    const [desireQuan, setDesireQuan] = useState(1); //희망수량
    const [orderType, setOrderType] = useState('reserve'); //사용자 선택 값 1.예약주문 2.배달주문

    const onChangeBudget = (e) => {
        const value = stringNumberToInt(e.target.value);
        if (isNaN(value)) {
            setBudget(0);
        } else {
            setBudget(value);
        }
    };

    //수량 변경
    const onIncrement = useCallback(() => {
        setDesireQuan(desireQuan + 1);
    }, [desireQuan]);

    const onDecrement = useCallback(() => {
        if (desireQuan > 1) {
            setDesireQuan(desireQuan - 1);
        }
    }, [desireQuan]);

    const onQuanChange = useCallback(e => {
        setDesireQuan(stringNumberToInt(e.target.value));
    }, [desireQuan])

    const onClickOk = () => {
        props.onCustomOrder(budget,desireQuan);
        setOrderType('reserve');
        setBudget(0);
        setDesireQuan(1);
    };
    const handleClose =()=>{
        setOrderType('reserve');
        setBudget(0);
        setDesireQuan(1);
        props.handleClose();
    }

    useEffect(() => {
        if (desireQuan < 1) {
            setDesireQuan(1);
        }
    }, [desireQuan]);

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        className={classes.close}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        맞춤주문
                    </Typography>
                </Toolbar>
            </AppBar>
         
            <div className={styles['title']}>전체 예산</div>
            <DialogContent className={classes.content}>
                <div className={styles['modal-input-box']}>
                    <input
                        value={numberFormat(budget)}
                        type="text"
                        onChange={onChangeBudget} />
                    <div className={styles['won']}>원</div>
                </div>
            </DialogContent>
            <div className={styles['title']}>희망 수량</div>
            <DialogContent className={classes.content}>
                <div className={styles['counter']}>
                    <IconButton
                        style={{ left: 0 }}
                        className={styles['box']}
                        onClick={onDecrement}
                    >
                        <img src={Minus} alt="minus" />
                    </IconButton>
                    <input className={styles['value']} onChange={onQuanChange} value={numberFormat(desireQuan)} /> 
                    
                    <IconButton
                        style={{ right: 0 }}
                        className={styles['box']}
                        onClick={onIncrement}
                    >
                        <img src={Plus} alt="plus" />
                    </IconButton>
                </div>
            </DialogContent>

            <FixButton title={'확인'} onClick={onClickOk} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
