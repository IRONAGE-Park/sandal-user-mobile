import React, { useRef } from 'react';
import styles from './SignInput.module.scss';
import classNames from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';
const cx = classNames.bind(styles);

//인증 버튼을 포함한 input box

const SignAuthInput = ({
    inputType,
    onChange,
    onClick,
    initValue,
    buttonTitle,
    placeholder,
    toggle,
    success,
    input_disabled, button_disabled
}) => {
    const authInputRef = useRef(null);
    return (
        <div className={styles['sign-input']}>
            <div>
                <input
                    className={styles['auth']}
                    type={inputType}
                    value={initValue}
                    placeholder={placeholder}
                    onChange={onChange}
                    autoComplete="on"
                    disabled={input_disabled}
                    ref={authInputRef}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            onClick();
                        }
                    }}
                />
            </div>
            <ButtonBase
                className={cx('auth-btn',
                    { toggle: toggle },
                    { success: success },
                )}
                onClick={onClick}
                disableRipple={button_disabled}
                disabled={button_disabled}
            >
                {buttonTitle}
            </ButtonBase>
        </div>
    );
};


export default SignAuthInput;
