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


    //open??? ??????????????? list ??????.
    useEffect(() => {
        setCpList(props.list);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);


    //?????? ??????
    const onClickSelectCoupon = useCallback((cp_id,cp_price,cp_minimum) => {
        const trueIndex = cp_list.findIndex((c)=>c.select===true); //true?????? ???????????? ??????.
        const prevList = cp_list.map((c)=> c.select=== true ? {...c, select:false} : c ); //?????? false??? ?????????
        const index = prevList.findIndex((c) => c.cp_id === cp_id);
        //true?????? index??? ?????? ?????????????????? index??? ????????? true??? ??????
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
            openModal('???????????? ??? ?????? ???????????????.',`???????????? ?????????\n${numberFormat(cp_minimum)}??? ????????? ??? ??????????????? ???????????????. `);
        }
        else if(props.total_price - cp_price < 10000){
            openModal('?????? ????????? ??????????????????.','?????? ?????? ????????? 10,000??? ???????????? ?????????.');
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
                        ?????? ??????
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['pd-box']}>
                <div className={styles['coupon']}>
                    <div className={styles['title']}>?????? ??????</div>
                    <div className={styles['coupon-list']}>
                        {cp_list.length!==0 ? 
                                <OrderCouponItemList
                                onClick={onClickSelectCoupon}
                                cp_list={cp_list}
                            />
                            :
                            <Message msg={"???????????? ?????? ????????? ????????????."}/>
                        }
                    </div>
                </div>
            </div>
            <FixButton title={'??????'} onClick={onClickOk} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
