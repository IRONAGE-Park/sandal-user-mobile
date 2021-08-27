import React from 'react';
import AddressContainer from 'containers/address/AddressContainer';

const Address = ({ match }) => {
    return <AddressContainer modal={match.params.modal} />;
}

export default Address;
