import React from 'react';

const active_color = '#007246';
const normal_color = '#ccc';
const BottomNavHome = (props) => {
    return (
        <svg width="24" height="24.13" viewBox="0 0 24 24.13">
            <g transform="translate(-63 -1383.87)">
                <g transform="translate(3.126 27.134)">
                    <path
                        d="M-13597.876-147l10.849-12.134,10.675,12.134"
                        transform="translate(13659 1517)"
                        fill="none"
                        stroke={props.active ? active_color : normal_color}
                        strokeWidth="1.5"
                    />
                    <path
                        d="M-13594.163-151.36v13.691h14.214V-151.36"
                        transform="translate(13659 1517)"
                        fill="none"
                        stroke={props.active ? active_color : normal_color}
                        strokeWidth="1.5"
                    />
                </g>
                <rect
                    width="24"
                    height="24"
                    transform="translate(63 1384)"
                    fill="none"
                />
            </g>
        </svg>
    );
};

BottomNavHome.defaultProps = {
    active: false,
};
export default BottomNavHome;
