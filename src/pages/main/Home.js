import React from 'react';
import qs from 'qs';
import HomeContainer from 'containers/main/HomeContainer';

function Home({ location }) {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    return <HomeContainer review_id={query.review_id} />;
}

export default Home;
