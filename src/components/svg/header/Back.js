import React from 'react';

const Back = ({ stroke, strokeWidth, onClick, rotate, width, height }) => {
    return (
        <svg style={{ transform: `rotate(${rotate})`}} width={width} height={height} viewBox="0 0 24 24" onClick={onClick}>
            <g transform="translate(13869 -3082)">
                <g>
                    <rect width="24" height="24" transform="translate(-13869 3082)" fill="none" />
                    <path d="M-13789.5,3079l-8.32,8.321,8.32,8.321" transform="translate(-63.676 6.5)" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
                </g>
            </g>
        </svg>
    );
};

Back.defaultProps = {
    rotate: '0',
    stroke: "#000",
    strokeWidth: "1",
    width: 24,
    height: 24
};

export default Back;