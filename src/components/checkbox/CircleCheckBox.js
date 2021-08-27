import React from 'react';
import styles from './CheckBox.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function CricleCheckBox({ id, text, check, onChange }) {
    return (
        <div className={cx('check', 'item')}>
            <div className={cx('sub-text')}>
                <input
                    type="checkbox"
                    id={id}
                    checked={check}
                    onChange={onChange}
                />
                <label className={cx('label', 'black')} htmlFor={id}>
                    <CheckBox on={check} />
                    {text}
                </label>
            </div>
        </div>
    );
}

function CheckBox({ on }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-24 -480)">
                <circle
                    cx="12"
                    cy="12"
                    r="12"
                    transform="translate(24 480)"
                    fill={on ? '#007246' : '#dbdbdb'}
                />
                <path
                    d="M492.5-1967.066l2.788,4.264,6.177-8"
                    transform="translate(-461 2459.302)"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
            </g>
        </svg>
    );
}
CricleCheckBox.defaultProps = {
    id: 'check',
    text: 'text',
    check: false,
    onChange: () => {},
    url: null,
};
