import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './TabMenu.module.scss';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useSelector } from 'react-redux';
import cn from 'classnames/bind';
const cx = cn.bind(styles);

const TabMenu = ({ tabs, index, onChange, isPush, center }) => {
    const history = useHistory();
    const { header } = useSelector((state) => state.scroll);

    const onClickTab = (url) => {
        if (url !== undefined) {
            isPush ? history.push(url) : history.replace(url);
        }
    };

    const tabList = tabs.map((tab) => (
        <Tab
            label={tab.name}
            key={tab.name}
            className={cx('tab-item', { center: center })}
            onClick={() => onClickTab(tab.url)}
        />
    ));

    return (
        <Tabs
            value={index}
            onChange={onChange}
            textColor="primary"
            TabIndicatorProps={{
                style: {
                    backgroundColor: '#007246',
                    height: '2px',
                    borderRadius: '100px',
                    color: 'red',
                },
            }}
            className={styles['tabs']}
            style={{
                top: header ? '0px' : '48px',
                boxShadow: header ? '0px 3px 20px rgba(0,0,0,0.1)' : '',
            }}
        >
            {tabList}
        </Tabs>
    );
};

TabMenu.defaultProps = {
    center: true,
    tabs: null,
    index: 0,
    isPush: false,
    onChange: () => {},
};

export default TabMenu;
