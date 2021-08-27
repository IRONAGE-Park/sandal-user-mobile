import React from 'react';

const active_color = '#007246';
const normal_color = '#ccc';

export default function OrderCheck({ check }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-24 -1320)">
                <circle style={{transition: 'fill .15s ease-in-out'}} cx="12" cy="12" r="12" transform="translate(24 1320)" fill={check ? active_color : normal_color} />
                <path d="M492.5-1967.066l2.788,4.264,6.177-8" transform="translate(-461 3299.302)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
        </svg>
    );
}

OrderCheck.defaultProps = {
    check: false,
};
