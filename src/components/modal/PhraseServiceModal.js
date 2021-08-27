import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames/bind'

import FixButton from '../button/Button';
import ImportLogo from '../svg/phrase/ImportLogo';
import DefaultLogo from '../svg/modal/Logo.svg'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import styles from './PhraseServiceModal.module.scss';
import { ButtonBase } from '@material-ui/core';
import PhraseTemplateList from '../asset/PhraseTemplateList';
import { requestPostPhraseSerive } from '../../api/order/sticker';
import { useModal } from '../../hooks/useModal';

const cn = classnames.bind(styles);

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

const InputLogo = ({ handleChange }) => {
    const [image, setImage] = useState(null);
    const handleImageChange = e => {
        if (e.target.files[0]) {
            handleChange(e.target.files);
            const reader = new FileReader();
            reader.onloadend = () => {
                // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                const base64 = reader.result;
                if (base64) {
                    setImage(base64.toString()); // 파일 상태 업데이트
                }
            }
            reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        }
    };

    return (
        <div className={styles['input-area']}>
            <ButtonBase className={cn('input-logo', 'input-box')}>
                <input
                    id="import-logo"
                    className={styles['filebox']}
                    type="file"
                    accept="image/gif, image/jpeg, image/png, image/svg"
                    onChange={handleImageChange}
                />
                <label className={styles['label']} htmlFor="import-logo" style={{ backgroundImage: 'url(' + image + ')'}}>
                    {!image && <div className={styles['add']}>
                        <div className={styles['import']}>
                            <ImportLogo />
                        </div>
                        <div className={styles['text']}>로고 가져오기</div>
                    </div>}
                </label>
            </ButtonBase>
        </div>
    );
};
const InputPhrase = ({ handleChange }) => {
    return (
        <div className={styles['input-area']}>
        <textarea
            className={cn('input-phrase', 'input-box')}
            onChange={e => handleChange(e.target.value)}
        />
    </div>
    )
}
const InputPreview = ({ template, logo, phrase }) => {
    const [preview, setPreview] = useState(null);
    const state = {};
    switch (template) {
        case 0:
            state.image = 'top'; state.text = 'bottom';
            break;
        case 1:
            state.image = 'bottom'; state.text = 'top'; 
            break;
        case 2:
            state.image = 'left'; state.text = 'right'; 
            break;
        default:
            state.image = 'right'; state.text = 'left'; 
            break;
    }
    useEffect(() => {
        if (logo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                const base64 = reader.result;
                if (base64) {
                    setPreview(base64.toString()); // 파일 base64 상태 업데이트
                }
            }
            reader.readAsDataURL(logo[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
        }
    }, [logo])
    return (
        <div className={styles['input-area']}>
            <ButtonBase disabled className={cn('input-preview', 'input-box')}>
                <div className={cn('circle', 'preview_out')}>
                    <div className={cn('circle', 'preview_in')}>
                        <div className={cn('box', 'image', state.image)}>
                            <img className={styles['logo']} src={preview ? preview : DefaultLogo} alt="미리보기 로고" />
                            <p className={styles['name']}>샌달 드림</p>
                        </div>
                        <div className={cn('box', 'text', state.text)}>
                            <p className={styles['phrase']}>{phrase}</p>
                        </div>
                    </div>
                </div>
            </ButtonBase>
        </div>
    );
};
const GuideTemplate = ({ title, children }) => (
    <div className={styles['guide']}>
        <h3 className={styles['title']}>{title}</h3>
        <div className={styles['content']}>
            {children}
        </div>
    </div>
);

export default ({ open, handleClose, order_number, token }) => {
    const classes = useStyles();
    const openModal = useModal();
    
    const [template, setTemplate] = useState(0);
    const [logo, setLogo] = useState(null);
    const [phrase, setPhrase] = useState('');
    
    const TemplateList = [
        { title: '템플릿을 선택해주세요.', content: <PhraseTemplateList template={template} handleChange={setTemplate} /> },
        { title: '첨부하실 로고를 선택해주세요.', content: <InputLogo handleChange={setLogo} /> },
        { title: '입력하실 문구를 입력하세요.', content: <InputPhrase phrase={phrase} handleChange={setPhrase} /> },
        { title: '문구 미리보기', content: <InputPreview template={template} logo={logo} phrase={phrase} /> }
    ];

    const onSubmit = useCallback(async () => {
        if (!logo) {
            openModal('로고 이미지가 없습니다!', '로고 이미지를 첨부해 주셔야 합니다.');
        } else if (phrase === '') {
            openModal('입력하실 문구가 없습니다!', '서비스 받을 문구를 입력해 주셔야 합니다.');
        } else {
            try {
                const res = await requestPostPhraseSerive(token, {
                    order_id: order_number,
                    sticker_logo: logo,
                    sticker_text: phrase
                });
                if (res.data.msg === '성공') {
                    openModal('문구서비스가 신청되었습니다!', '고객님이 원하시는 문구를 작성해 드리겠습니다.');
                    handleClose();
                } else if (res.data.msg === '이미 해당 주문번호에 대한 스티커가 존재') {
                    openModal('문구 스티커는 한 번만 신청할 수 있습니다.');
                }
                else {
                    openModal('예기치 못한 에러가 발생했습니다!', '다시 시도해 주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 다시 시도해 주세요.');
            }
        }
    }, [logo, phrase, order_number, token, openModal, handleClose]);
    
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.close} color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        문구 서비스 신청
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles['container']}>
                {TemplateList.map((template, index) => (
                    <GuideTemplate key={index} title={template.title}>
                        {template.content}
                    </GuideTemplate>
                ))}
            </div>
            <FixButton title={'신청하기'} onClick={onSubmit} toggle={true}/>
        </Dialog>
    );
};