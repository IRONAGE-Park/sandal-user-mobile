import React from 'react';
import styles from './SquareBox.module.scss';
import cn from 'classnames/bind';

const cx = cn.bind(styles);

export default function SquareCheckBox({ id, text, check, onChange }) {
    return (
        <div className={cx('check', 'item')}>
            <div className={cx('sub-text')}>
                <input
                    type="checkbox"
                    id={id}
                    checked={check}
                    onChange={onChange}
                />
                <label className={styles['label']} htmlFor={id}>
                    <SquareBox on={check} />
                    {text}
                </label>
            </div>
        </div>
    );
}

function SquareBox({ on }) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16">
            <g transform="translate(-280 -630)">
                <g
                    transform="translate(280 630)"
                    fill="#fff"
                    stroke="#dbdbdb"
                    strokeWidth="1"
                >
                    <rect width="16" height="16" stroke="none" />
                    <rect x="0.5" y="0.5" width="15" height="15" fill="none" />
                </g>
                {on && (
                    <path
                        d="M-11414.308,3665.579l2.9,2.716.656.614,5.9-9.308"
                        transform="translate(11698 -3027)"
                        fill="none"
                        stroke="#707070"
                        strokeWidth="1"
                    />
                )}
            </g>
        </svg>
    );
}
