import React from 'react';
import ko from 'date-fns/locale/ko';
import DatePicker from 'react-datepicker';
import styles from './DatePicker.module.scss';
import './DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({
    date,
    setDate,
    position = 'auto',
    minDate,
    maxDate,
}) => {
    return (
        <div className={styles['date-picker']}>
            <DatePicker
                locale={ko}
                dateFormat="yyyy-MM-dd"
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={minDate}
                maxDate={maxDate}
                className={styles['test']}
                popperPlacement={position}
                popperModifiers={{
                    preventOverflow: {
                        enabled: false,
                    },
                    hide: {
                        enabled: false,
                    },
                }}
            />
        </div>
    );
};
export default CustomDatePicker;
