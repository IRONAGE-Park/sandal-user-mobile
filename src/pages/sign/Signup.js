import React from 'react';
import SignUpContainer from 'containers/sign/SignUpContainer';

const SignUp = ({ match }) => {
    return <SignUpContainer modal={match.params.modal} />;
}

export default SignUp;
