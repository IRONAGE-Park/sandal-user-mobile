import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import classNames from 'classnames/bind';

import { useHistory } from 'react-router-dom';
import { Paths } from 'paths'
import { localLogin, localRegister } from '../../api/auth/auth';
import styles from './Sign.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import SignAuthInput from 'components/sign/SignAuthInput';
import Button from 'components/button/Button';
import { useModal } from '../../hooks/useModal';
import CheckBox from 'components/checkbox/CheckBox';
import { isEmailForm, isPasswordForm } from '../../lib/formatChecker';
import AgreeModal from '../../components/modal/AgreeModal';
import AuthPhone from '../../components/sign/AuthPhone';

const cx = classNames.bind(styles);

const initialUserState = {
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    phoneNumber: '',
    agree_marketing: 0
};

const initCheck = {
    allCheck: false,
    check1: false,
    check2: false,
    check3: false,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_USER_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'UPDATE_USER_EMAIL':
            return {
                ...state,
                email: action.email
            }
        case 'UPDATE_USER_PASSWORD':
            return {
                ...state,
                password: action.password
            }
        case 'UPDATE_USER_COMPARE':
            return {
                ...state,
                password_confirm: action.password_confirm
            }
        case 'UPDATE_USER_PHONENUMBER':
            return {
                ...state,
                phoneNumber: action.phoneNumber
            }
        case 'UPDATE_USER_AGREE_MARKETING':
            return {
                ...state,
                agree_marketing: action.agree_marketing
            }
        default:
            return state;
    };
};

const checkReducer = (state, action) => {
    switch (action.type) {
        case 'ALL_CHECK':
            return {
                ...state,
                allCheck: action.check,
            }
        case 'CHECK1':
            return {
                ...state,
                check1: action.check
            }
        case 'CHECK2':
            return {
                ...state,
                check2: action.check
            }
        case 'CHECK3':
            return {
                ...state,
                check3: action.check
            }
        default:
            return state;
    };
};

const SignUpContainer = ({ modal }) => {
    const openModal = useModal();
    const history = useHistory();
    const [user, dispatchUser] = useReducer(userReducer, initialUserState);
    const { email, password, password_confirm } = user;

    const [phoneAuth, setPhoneAuth] = useState(false);

    const [compare, setCompare] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [check, dispatchCheck] = useReducer(checkReducer, initCheck);
    const { check1, check2, check3 } = check;

    const [overlap, setOverlap] = useState(false);
    const passwordInputRef = useRef(null);

    const updateToggle = useCallback(() => {
        const checkbox = (check1 && check2);
        const userinfo = (email.length !== 0 && compare);
        const result = (checkbox && userinfo && overlap && phoneAuth);
        setToggle(result);
    }, [check1, check2, email, overlap, compare, phoneAuth]);

    // ???????????? ?????? ??????
    const matchPassword = useCallback(() => {
        if (password.length !== 0 && password_confirm.length !== 0) {
            setCompare(password === password_confirm);
        }
        else {
            setCompare(false);
        }
    }, [password, password_confirm]);

    // ?????? ???????????? ????????? ??????????????? ??????
    const onToggleCheck = useCallback(() => {
        if (check1 && check2 && check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: true });
        }
        else if (!check1 || !check2 || !check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: false });
        }
    }, [check1, check2, check3]);

    // ?????? ???????????? ?????? ??????
    const isAllCheck = useCallback(() => {
        if (check1 && check2 && check3) {
            dispatchCheck({ type: 'ALL_CHECK', check: true });
        } else {
            dispatchCheck({ type: 'ALL_CHECK', check: false });
        }
    }, [check1, check2, check3]);

    useEffect(updateToggle, [updateToggle]);
    useEffect(matchPassword, [matchPassword]);
    useEffect(isAllCheck, [isAllCheck]);
    useEffect(onToggleCheck, [onToggleCheck]);

    const updateAllCheck = useCallback(e => {
        dispatchCheck({ type: 'ALL_CHECK', check: e.target.checked });
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
        dispatchCheck({ type: 'CHECK3', check: e.target.checked });
    }, []);
    const onChangeCheck1 = useCallback(e => {
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
    }, []);
    const onChangeCheck2 = useCallback(e => {
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
    }, []);
    const onChangeCheck3 = useCallback(e => {
        dispatchCheck({ type: 'CHECK3', check: e.target.checked });
    }, []);
    const updateEmail = useCallback(e => {
        setOverlap(false);
        dispatchUser({ type: 'UPDATE_USER_EMAIL', email: e.target.value });
    }, []);
    const updatePassword = useCallback(e => {
        dispatchUser({ type: 'UPDATE_USER_PASSWORD', password: e.target.value });
    }, []);
    const updatePhoneNumber = useCallback(e => {
        dispatchUser({ type: 'UPDATE_USER_PHONENUMBER', phoneNumber: e.target.value });
    }, []);
    const updateConfirm = useCallback(e => {
        dispatchUser({ type: 'UPDATE_USER_COMPARE', password_confirm: e.target.value });
    }, []);
    const confirm = useCallback(() => {
        if (password.length !== 0 || password_confirm.length !== 0) {
            return compare ? "??????????????? ???????????????." : "??????????????? ??????????????????.";
        }
    }, [password, password_confirm, compare]);
    const onClickOverlapCheck = useCallback(async () => {
        if (isEmailForm(email)) {
            if (overlap) {
                openModal('?????? ?????? ?????? ???????????????.', '?????? ????????? ????????? ?????????.');
            } else {
                try {
                    const res = await localLogin(email);
                    if (res.data.msg === '??????????????? ???????????????.') {
                        openModal('????????? ??????????????????.', '?????? ???????????? ????????? ?????????.');
                    } else if (res.data.msg === '????????? ??????????????????.') {
                        openModal(res.data.msg, '?????? ???????????? ????????? ?????????.');
                    } else {
                        openModal('?????? ????????? ??????????????????.', '?????? ????????? ???????????????.');
                        setOverlap(true);
                    }
                } catch (e) {
                    openModal("????????? ????????? ?????????????????????.", "????????? ?????? ????????? ?????????.");
                }
            }
        } else {
            openModal('????????? ????????? ???????????????.', '????????? ????????? ????????? ?????????.');
        }
    }, [email, openModal, overlap]);

    const onClickSignUp = useCallback(async () => {
        if (isPasswordForm(password)) {
            try {
                // const res = await localRegister(email, password, password_confirm, check3);
                await localRegister(email, password, password_confirm, check3);
                history.push(`${Paths.ajoonamu.complete}/${email}`);
            } catch (e) {
                openModal('????????? ????????? ??????????????????.', '?????? ??? ?????? ????????? ?????????.');
            }
        } else {
            openModal("???????????? ????????? ?????? ????????????!", '8??? ???????????? ??????, ?????? ??? ??????????????? ?????? ??????????????? ?????????.', () => passwordInputRef.current.focus());
        }
    }, [email, password, password_confirm, check3, openModal, history]);

    return (
        <>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <SignAuthInput inputType={"email"} initValue={user.email} onChange={updateEmail} placeholder={"?????????"} buttonTitle={`???????????? ${overlap ? "??????" : ""}`} onClick={onClickOverlapCheck} success={overlap}/>
                    <SignNormalInput inputType={"password"} initValue={user.password} onChange={updatePassword} placeholder={"????????????"} reference={passwordInputRef} />
                    <SignNormalInput inputType={"password"} initValue={user.password_confirm} onChange={updateConfirm} placeholder={"???????????? ??????"} />
                    <div className={cx('compare', { on: compare, not_view: user.password.length === 0 || user.password_confirm.length === 0 })}>
                        <label>{confirm()}</label>
                    </div>
                    <AuthPhone
                        userPhone={user.phoneNumber}
                        onChangePhone={updatePhoneNumber}
                        success={phoneAuth}
                        setSuccess={setPhoneAuth}
                    />
                </div>
                <AcceptContainer
                    {...check}
                    updateAllCheck={updateAllCheck}
                    onChangeCheck1={onChangeCheck1}
                    onChangeCheck2={onChangeCheck2}
                    onChangeCheck3={onChangeCheck3}
                    modal={modal ? modal : false}
                />
            </div>
            <Button title={"?????? ??????"} onClick={onClickSignUp} toggle={toggle} ></Button>
        </>
    );
};

const AcceptContainer = (props) => {
    const history = useHistory();

    const onOpenPolicyModal = () => history.push(Paths.ajoonamu.signup + '/policy');
    const onOpenTermModal = () => history.push(Paths.ajoonamu.signup + '/term');
    const onCloseModal = () => history.goBack();

    return (
        <div className={cx('agree')}>
            <div className={cx('all-box')}>
                <CheckBox
                    id={'all'}
                    text={'?????? ???????????????.'}
                    check={props.allCheck}
                    onChange={props.updateAllCheck}
                    upgrade
                />
            </div>
            <div className={styles['terms']}>
                <div className={cx('pd-sub-top')}>
                    <CheckBox
                        id={'check1'}
                        text={'???????????????????????? ?????? ??????'}
                        check={props.check1}
                        onChange={props.onChangeCheck1}
                        onClick={onOpenPolicyModal}
                    />
                    <CheckBox
                        id={'check2'}
                        text={'???????????? ?????? ??????'}
                        check={props.check2}
                        onChange={props.onChangeCheck2}
                        onClick={onOpenTermModal}
                    />
                    <CheckBox
                        id={'check3'}
                        text={'?????????, ?????? ?????? ??????'}
                        check={props.check3}
                        onChange={props.onChangeCheck3}
                    />
                    <div className={styles['sms']}>
                        <div className={styles['sub-text']}>
                            <span>
                                SMS, ???????????? ?????? ??????/?????????/?????? ?????????
                            </span>
                            <br />
                            <span>???????????? ??? ????????????.</span>
                        </div>
                    </div>
                </div>
            </div>
            <AgreeModal title={props.modal} handleClose={onCloseModal} />
        </div>
    );
};

export default SignUpContainer;