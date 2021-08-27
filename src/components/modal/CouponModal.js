import React ,{useState,useEffect, useCallback}from 'react';
import FixButton from 'components/button/Button';
import OrderCouponItemList from '../../components/coupon/OrderCouponItemList';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import produce from 'immer';


import styles from './Coupon.module.scss';
import  Message from '../message/Message';

//hooks
import {useModal} from '../../hooks/useModal';

//lib
import { numberFormat } from '../../lib/formatter';

const useStyles = makeStyles((theme) => ({
    container:{
        paddingBottom:"60px",
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

    const openModal = useModal();
    const classes = useStyles();
    const [cp_list, setCpList] = useState([]);
    const [cp_price, setCpPrice] = useState(0);
    const [cp_id, setCpId] = useState('');
    const [cp_minimum ,setCpMinimum] = useState(0);


    //open이 바뀔때마다 list 갱신.
    useEffect(() => {
        setCpList(props.list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);


    //쿠폰 클릭
    const onClickSelectCoupon = useCallback((cp_id,cp_price,cp_minimum) => {
        const trueIndex = cp_list.findIndex((c)=>c.select===true); //true였던 인덱스를 뽑음.
        const prevList = cp_list.map((c)=> c.select=== true ? {...c, select:false} : c ); //전부 false로 초기화
        const index = prevList.findIndex((c) => c.cp_id === cp_id);
        //true였던 index랑 현재 바꾸고자하는 index가 같을시 true로 갱신
        if (trueIndex === index) {
            prevList[index].select = true;
        }
        setCpList(
            produce(prevList, (draft) => {
                draft[index].select = !draft[index].select;
            }),
        );
        if (trueIndex === index) {
            setCpPrice(0);
            setCpMinimum(0);
            setCpId(null);
        } else {
            setCpPrice(cp_price);
            setCpId(cp_id);
            setCpMinimum(cp_minimum);
        }
    },[cp_list]);

    const onClickOk = () => {
        if(props.item_price <cp_minimum){
            openModal('사용하실 수 없는 쿠폰입니다.',`최소주문 금액이\n${numberFormat(cp_minimum)}원 이상일 때 사용가능한 쿠폰입니다. `);
        }
        else if(props.total_price - cp_price < 10000){
            openModal('주문 금액을 확인해주세요.','최소 결제 금액은 10,000원 이상부터 입니다.');
        }
        else{
            props.handleClose();
            props.onClick(cp_price, cp_id, cp_list);
        }
     
    };
    const onClickCancle = () => {
        props.handleClose();
    };


    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition} className={classes.container}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.close} color="inherit" onClick={onClickCancle} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        할인 쿠폰
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['pd-box']}>
                <div className={styles['coupon']}>
                    <div className={styles['title']}>쿠폰 선택</div>
                    <div className={styles['coupon-list']}>
                        {cp_list.length!==0 ? 
                                <OrderCouponItemList
                                onClick={onClickSelectCoupon}
                                cp_list={cp_list}
                            />
                            :
                            <Message msg={"보유하고 있는 쿠폰이 없습니다."}/>
                        }
                    </div>
                </div>
            </div>
            <FixButton title={'확인'} onClick={onClickOk} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
