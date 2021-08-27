import React,{useRef,useEffect} from 'react';
import styles from './Address.module.scss';
import classNames from 'classnames/bind';
import { makeStyles } from '@material-ui/core/styles';
import { BsSearch } from 'react-icons/bs';
import AddrItemList from 'components/address/AddrItemList';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import FixButton from 'components/button/Button';


const cx = classNames.bind(styles);

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        borderBottom: 'solid 1px #aaa',
        fontSize: 10
    },
    title: {
        textAlign: 'center',
        width: '100%',
        fontSize: 16
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content:{
        padding: 0,
        paddingLeft :24,
        paddingRight:24,
        paddingBottom:60,
        flex: "0 0 auto"
    },
    close: {
        position: 'absolute',
        width: '40px', height: '40px',
        left: 14, zIndex: 2100,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddressModal = (props) => {
    const classes = useStyles();
    const inputRef = useRef(null);
    const {selectAddr ,detailAddr,addrs,searchAddr} = props;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectAddr]);

    return (
        <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton 
                        className={classes.close}
                        color="inherit" 
                        onClick={props.handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        배달 받을 주소
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['title']}>배달 받을 주소</div>
            <DialogContent className={classes.content}>
            <div className={styles['container']}>
                    <div className={styles['modal-input-box']}>
                        <input className={styles['modal-input']} type="text" value={searchAddr} placeholder="예) 샌달동12-3 또는 샌달 아파트" onChange={props.onChangeAddr} onKeyPress={props.handleKeyPress}></input>
                        <div className={styles['search-btn']} onClick={props.onSearch} ><BsSearch /></div>
                    </div>
                    <div className={styles['result']}>
                    {addrs ? `총 ${addrs.length}개의 검색결과가 있습니다.` : "0개의 검색결과가 있습니다."}

                    </div>
                    <div className={styles['addrs-list']}>
                        {addrs ? <AddrItemList addrs={addrs} onClick={props.onClickAddrItem} /> : ""}
                    </div>
                    <div className={styles['select-addr']}>
                        {selectAddr ? selectAddr : ""}
                    </div>
                    <input className={cx('modal-input','md-top')} type="text" value={detailAddr} placeholder="상세 주소를 입력하세요." onChange={props.onChangeDetail} ref={inputRef}></input>
            </div>
            </DialogContent>
            <FixButton title={"이 주소로 배달지 설정"} toggle={true} onClick={props.onClick}/>
        </Dialog>
    );
}

export default AddressModal;