import React from 'react';
import qs from 'qs';
import SupportContainer from 'containers/support/SupportContainer';
import QNAContainer from '../../containers/support/QNAContainer';
import { Switch, Route } from 'react-router-dom';
import { Paths } from '../../paths';

const Support = ({ match, location }) => {
    const { tab } = match.params;
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const id = query.id;
    return (
        <Switch>
            <Route
                exact
                path={`${Paths.ajoonamu.support}/:tab`}
                render={() => <SupportContainer tab={tab} />}
            />
            <Route
                path={`${Paths.ajoonamu.support}/qna/:tab`}
                render={({ match }) => (
                    <QNAContainer tab={match.params.tab} query={id} />
                )}
            />
        </Switch>
    );
};

export default Support;
