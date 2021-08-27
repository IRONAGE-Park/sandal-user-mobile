import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import ProfileCoverImage from '../asset/ProfileCoverImage';

const useStyles = makeStyles(() => ({
    appBar: {
        position: 'relative',
        textAlign: 'center',
        backgroundColor: 'rgb(17, 17, 17)',
        color: '#fff',
        boxShadow: 'none',
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
        backgroundColor: 'rgb(17, 17, 17)',
        position: 'absolute',
        width: '100%', height: '100%',
        top: '0px', left: '0px'
    },
    profile: {
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)'
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

const FullScreenDialog = ({ src, open, handleClose }) => {
    const classes = useStyles();

    return (
        <Dialog
            fullScreen
            open={open}
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
                        프로필 이미지
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.content}>
                <div className={classes.profile}>
                    <ProfileCoverImage src={src} size={200} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenDialog;
