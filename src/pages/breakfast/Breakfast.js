import React from 'react';
import BreakfastContainer from 'containers/breakfast/BreakfastContainer';
import qs from 'qs';

const Breakfast = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const menu = query.menu !== undefined ? query.menu : '0';
    return <BreakfastContainer menu={parseInt(menu)} />;
};
export default Breakfast;
