import React from 'react';
import AccountContainer from 'containers/account/AccountContainer';

const Account = ({ match }) => {
    return <AccountContainer modal={match.params.modal} />;
}

export default Account;
