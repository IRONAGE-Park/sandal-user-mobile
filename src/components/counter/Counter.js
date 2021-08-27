import React, { useCallback } from 'react';
import { ButtonBase } from '@material-ui/core';
import styles from './Counter.module.scss';

import Plus from '../svg/counter/cross.svg';
import Minus from '../svg/counter/line.svg';
import { numberFormat } from '../../lib/formatter';

export default function Counter({ value, onIncrement, onDecrement, onChange, onKeyDown }) {


    return (
        <div className={styles['counter']}>
            <ButtonBase
                style={{ left: 0 }}
                className={styles['box']}
                onClick={onDecrement}
            >
                <img src={Minus} alt="minus" />
            </ButtonBase>
            <input type="text" className={styles['value']} value={numberFormat(value)} onKeyDown={onKeyDown} onChange={onChange} />
            <ButtonBase
                style={{ right: 0 }}
                className={styles['box']}
                onClick={onIncrement}
            >
                <img src={Plus} alt="plus" />
            </ButtonBase>
        </div>
    );
}
