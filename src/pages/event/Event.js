import React from 'react';
import EventContainer from '../../containers/event/EventContainer';
import EventListContainer from '../../containers/event/EventListContainer';

export default ({ match }) => {
    const post = match.params.post;

    return <>{post ? <EventContainer id={post} /> : <EventListContainer />}</>;
};
