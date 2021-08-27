import React from 'react';

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

import { useSelector } from 'react-redux';

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
        padding: '0 24px',
        paddingBottom: '60px',
        flex: '0 0 auto',
    },
    pre: {
        padding: '24px 16px',
        overflow: 'auto',
        fontSize: '14px',
        lineHeight: '1.5'
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

const FullScreenDialog = ({ title, handleClose }) => {
    const classes = useStyles();
    const { company } = useSelector(state => state.company);

    return (
        <Dialog
            fullScreen
            open={title}
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
                        {title === 'policy' ? '개인정보처리방침' : '이용약관'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                <div className={classes.pre} dangerouslySetInnerHTML={{ __html: company && (title === 'policy' ? company.private_policy_user : company.use_terms_user) }} />
            </DialogContent>
            <FixButton title={'확인'} onClick={handleClose} toggle={true} />
        </Dialog>
    );
};

export default FullScreenDialog;
