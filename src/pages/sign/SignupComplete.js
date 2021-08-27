import React from 'react';
import SignCompleteContainer from 'containers/sign/SignCompleteContainer';

const SignupComplete = ({ match }) => {
    return <SignCompleteContainer name={match.params.email} />;
};

export default SignupComplete;
