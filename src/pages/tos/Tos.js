import React from 'react';
import TosContainer from 'containers/tos/TosContainer';
import qs from 'qs';

const Tos = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const tab = query.tab;
    return <TosContainer tab={tab} />;
};

export default Tos;
