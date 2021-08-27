import React from 'react';
import classnames from 'classnames/bind';

import styles from './SwiperTab.module.scss';
import SwipeableTabs from 'react-swipeable-tabs';
import { ButtonBase } from '@material-ui/core';
import { useSelector } from 'react-redux';

const cn = classnames.bind(styles);

const SwiperTab = ({ idx, categorys, onChange }) => {
    const { header } = useSelector((state) => state.scroll);
    return (
        <div className={cn('tab', { not_view: header })}>
            <div className={styles['items']}>
                <SwipeableTabs
                    noFirstLeftPadding={false}
                    noLastRightPadding={false}
                    fitItems={ !(categorys.length > 5 )}
                    alignCenter={true}
                    borderWidthRatio={1}
                    activeItemIndex={idx}
                    onItemClick={(item, index) => onChange(index)}
                    items={categorys.map((category) => (
                        <Tab ca_name={category.ca_name} />
                    ))}
                    borderPosition="bottom"
                    borderThickness={4}
                    itemClassName={styles['item']}
                    borderColor="#007246"
                    activeStyle={{color: '#007246',}}
                />
            </div>
        </div>
    );
};

const Tab = ({ ca_name }) => (
    <ButtonBase className={styles['ca_name']}>{ca_name}</ButtonBase>
);

export default SwiperTab;
