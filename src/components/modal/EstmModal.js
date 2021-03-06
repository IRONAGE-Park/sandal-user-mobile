import React, { useReducer, useCallback, useState } from 'react';
import classNames from 'classnames/bind';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { requestPostEstimate } from '../../api/order/estimate';

import Estimate from '../asset/Estimate';
import { ButtonBase } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';

import styles from './EstmModal.module.scss';
import { isEmailForm } from '../../lib/formatChecker';
import { useModal } from '../../hooks/useModal';
import Loading from '../asset/Loading';
import SDGothicNEO_R from './AppleSDGothicNeoR';
import SDGothicNEO_B from './AppleSDGothicNeoB';
import { useSelector } from 'react-redux';
import { numberFormat } from '../../lib/formatter';


const cx = classNames.bind(styles);

const useStyles = makeStyles(() => ({
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
    estimate: {
        marginTop: 48,
        marginBottom: 73,
        paddingBottom: 73,
    },
    estimatePreview: {
        width: '100%',
    },
    sub: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    close: {
        position: 'absolute',
        width: '40px', height: '40px',
        left: 14, zIndex: 2100
    },
}));

const reducer = (state, action) => ({
    ...state,
    [action.name]: action.value,
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EstmModal = (props) => {
    const classes = useStyles();
    const openModal = useModal();

    const { company } = useSelector(state => state.company);
    const { com_name, addr1, addr2, ceo_name, tel, business_num } = company;

    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        receiver: '',
        receiver_email: '',
    });
    const [estmFile, setEstmFile] = useState(null);

    const onStateChange = useCallback(e => dispatch(e.target), []);
    const sendEstimate = useCallback(async () => {
        if (props.total > company.minimum_order) {
            
            if (estmFile) {
                if (isEmailForm(state.receiver_email)) {
                    const token = localStorage.getItem('access_token');
                    setLoading(true);
                    try {
                        const { receiver, receiver_email } = state;
                        const res = await requestPostEstimate(token, {
                            estm_email: receiver_email,
                            estm_username: receiver,
                            estm_file: estmFile,
                        });
                        if (res.data.msg === "??????") {
                            openModal('??????????????? ?????????????????????!', '???????????? ????????? ?????????!');    
                            props.onClick();
                        } else {
                            openModal('????????? ??????????????????.', '?????? ????????? ?????????.');
                        }
                    } catch (e) {
                        openModal('????????? ?????? ????????? ??????????????????!', '?????? ????????? ?????????.');
                    }
                    setLoading(false);
                } else {
                    openModal('????????? ????????? ???????????????.', '????????? ????????? ????????? ?????????.');
                }
            } else {
                openModal('???????????? ?????? ??? ??????????????? ?????????.', '???????????? ??? ??? ?????? ?????? ??????????????????.');
            }
        } else {
            openModal(
                '?????? ?????? ????????? ???????????????.',
                `?????? ?????? ????????? ${numberFormat(
                    company.minimum_order,
                )}????????????.`,
            );
        }
    }, [props, company.minimum_order, estmFile, state, openModal]);

    const onDownload = () => {
        const doc = new jsPDF('p', 'mm');
        doc.addFileToVFS('AppleSDGothicNeoR.ttf', SDGothicNEO_R);
        doc.addFileToVFS('AppleSDGothicNeoB.ttf', SDGothicNEO_B);
        doc.addFont('AppleSDGothicNeoR.ttf', 'apple', 'normal');
        doc.addFont('AppleSDGothicNeoB.ttf', 'apple', 'bold');
        doc.setFont('apple');
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontSize: '30',
                fontStyle: 'bold',
                halign: 'center'
            },
            body: [['?????????']]
        })
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                lineWidth: 0.5,
                lineColor: '#222',
                overflow: 'linebreak',
                halign: 'right',
                valign: 'middle'
            },
            headStyles: {
                halign: 'center'
            },
            html: '#estimate-table',
        });
        doc.autoTable({
            theme: 'plain',
            styles: {
                font: 'apple',
                fontStyle: 'normal',
                halign: 'center',
                fontSize: '12',
            },
            footStyles: {
                fontSize: '24',
                fontStyle: 'bold',
            },
            margin: { top: 100 },
            body: [['????????? ?????? ???????????? ???????????????.']],
            foot: [['?????? ??????']]
        })
        
        const blob = doc.output('blob');
        const makeFile = new File([blob], '?????? ?????????.pdf', {
            type: blob.type,
        });
        window.open(doc.output('bloburl'));
        setEstmFile(makeFile);
        setLoading(false);
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
                        onClick={props.handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        ????????? ??????
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['title']}>?????????</div>
            <DialogContent className={classes.content}>
                <div className={styles['modal-input-box']}>
                    <input
                        name="receiver"
                        className={styles['modal-input']}
                        onChange={onStateChange}
                        type="text"
                    />
                </div>
            </DialogContent>
            <div className={styles['title']}>?????? ????????? ??????</div>
            <DialogContent className={classes.content}>
                <div className={styles['modal-input-box']}>
                    <input
                        name="receiver_email"
                        className={styles['modal-input']}
                        onChange={onStateChange}
                        type="email"
                    />
                </div>
            </DialogContent>
            <DialogContent
                className={`${classes.content} ${classes.estimate}`}
            >
                <ButtonBase className={classes.estimatePreview}>
                <Estimate
                    receiver={state.receiver}
                    com_name={com_name} ceo_name={ceo_name}
                    address={addr1 + ' ' + addr2} business_num={business_num}
                    tel={tel}
                    onDownload={onDownload}
                    products={props.cartList}
                    dlvCost={props.dlvCost}
                />
                </ButtonBase>
            </DialogContent>
            <LinkButton
                on={true}
                onClose={props.onClick}
                onSubmit={sendEstimate}
            />
            <Loading open={loading} />
        </Dialog>
    );
};

const LinkButton = ({ on, onClose, onSubmit }) => (
    <div className={styles['btn']}>
        <div className={cx('item', { on: !on })} onClick={onClose}>
            ????????????
        </div>
        <div className={cx('item', { on: on })} onClick={onSubmit}>
            ????????? ??????
        </div>
    </div>
);

export default EstmModal;
