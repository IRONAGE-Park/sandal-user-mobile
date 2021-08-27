import React from 'react';

export default ({ fill = "#222", boxShadow, onClick }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 39 20"
        fill={fill}
        onClick={onClick}
    >
        <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1"/>
        </filter>
        <path
            id="long-arrow-left-light"
            d="M12.036,150.187l.621-.621a1.055,1.055,0,0,0,0-1.491l-7.375-7.333H38.313a1.055,1.055,0,0,0,1.054-1.054v-.879a1.055,1.055,0,0,0-1.054-1.054H5.283l7.375-7.333a1.055,1.055,0,0,0,0-1.491l-.621-.621a1.054,1.054,0,0,0-1.491,0L.309,138.5a1.055,1.055,0,0,0,0,1.491l10.236,10.193A1.054,1.054,0,0,0,12.036,150.187Z"
            transform="translate(0 -128)"
            style={{
                filter: boxShadow && 'url(#shadow)'
            }}
        />
    </svg>
);
