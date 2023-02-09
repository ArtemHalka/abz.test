import React from 'react';

const Token = ({ getTokenHandler }) => {
    return <button onClick={getTokenHandler}>Get Token</button>;
};

export default Token;
