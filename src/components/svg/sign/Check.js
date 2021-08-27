import React from 'react';

export default function Check({ on }) {
    return (
        <svg width="17.096" height="15.17" viewBox="0 0 17.096 15.17">
            <path
                style={{transition: 'stroke .15s cubic-bezier(0.77, 0, 0.175, 1)'}}
                d="M492.5-1964.84l4.45,6.806,9.859-12.768"
                transform="translate(-491.116 1972.204)"
                fill="none" stroke={on ? '#007246' : '#ebebeb'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            />
        </svg>
    );
};

export const UpgradeCheck = ({ on }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
        >
            <g transform="translate(-48 -493)">
                <g transform="translate(48 493)"
                    fill="none"
                    stroke={on ? '#007246' : '#ebebeb'}
                    strokeWidth="1"
                    style={{transition: 'stroke .15s cubic-bezier(0.77, 0, 0.175, 1)'}}
                >
                    <circle cx="14" cy="14" r="14" stroke="none" />
                    <circle cx="14" cy="14" r="13.5" fill="none" />
                </g>
                <path d="M492.5-1966.524l3.193,4.882,7.073-9.16"
                    transform="translate(-436 2473.302)"
                    fill="none"
                    stroke={on ? '#007246' : '#ebebeb'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    style={{transition: 'stroke .15s cubic-bezier(0.77, 0, 0.175, 1)'}}
                />
            </g>
        </svg>
    );
}
