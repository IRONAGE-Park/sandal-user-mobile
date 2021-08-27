import React from 'react';

const active_color = '#007246';
const normal_color = '#ccc';
const BottomNavOrderList = (props) => {
    return (
        <svg width="24" height="24.5" viewBox="0 0 24 24.5">
            <g transform="translate(13382 74)">
                <g>
                    <g>
                        <rect
                            width="24"
                            height="24"
                            transform="translate(-13382 -74)"
                            fill="none"
                        />
                        <g transform="translate(0 0.5)">
                            <g transform="translate(-13379 -73)" fill="none">
                                <path
                                    d="M17,23H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H6.47A.5.5,0,0,0,6.5,1h5a.5.5,0,0,0,.03-1H17a1,1,0,0,1,1,1V22A1,1,0,0,1,17,23Z"
                                    stroke="none"
                                />
                                <path
                                    d="M 16.5 21.50040054321289 L 16.5 1.500900387763977 L 13.23092746734619 1.500900387763977 C 12.88458919525146 2.097685098648071 12.2384729385376 2.499900341033936 11.50020027160645 2.499900341033936 L 6.499800205230713 2.499900341033936 C 5.761527538299561 2.499900341033936 5.115410804748535 2.097685098648071 4.769073009490967 1.500900387763977 L 1.5 1.500900387763977 L 1.5 21.50040054321289 L 16.5 21.50040054321289 M 17.00009918212891 23.00040054321289 L 0.9998999834060669 23.00040054321289 C 0.4485499858856201 23.00040054321289 0 22.55185127258301 0 22.0004997253418 L 0 1.000800371170044 C 0 0.4494504034519196 0.4485499858856201 0.0009004058665595949 0.9998999834060669 0.0009004058665595949 L 6.470099925994873 0.0009004058665595949 C 6.206679821014404 0.01633040606975555 6.00029993057251 0.2348604053258896 6.00029993057251 0.5004004240036011 C 6.00029993057251 0.7758303880691528 6.224370002746582 0.9999004006385803 6.499800205230713 0.9999004006385803 L 11.50020027160645 0.9999004006385803 C 11.77562999725342 0.9999004006385803 11.99969959259033 0.7758303880691528 11.99969959259033 0.5004004240036011 C 11.99969959259033 0.2357304096221924 11.79333972930908 0.01633040606975555 11.5298900604248 0.0009004058665595949 L 17.00009918212891 0.0009004058665595949 C 17.55145072937012 0.0009004058665595949 18 0.4494504034519196 18 1.000800371170044 L 18 22.0004997253418 C 18 22.55185127258301 17.55145072937012 23.00040054321289 17.00009918212891 23.00040054321289 Z"
                                    stroke="none"
                                    fill={
                                        props.active
                                            ? active_color
                                            : normal_color
                                    }
                                />
                            </g>
                            <g
                                transform="translate(-13374 -74.5)"
                                fill="none"
                                stroke={
                                    props.active ? active_color : normal_color
                                }
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                            >
                                <rect
                                    width="8"
                                    height="4"
                                    rx="1"
                                    stroke="none"
                                />
                                <rect
                                    x="0.75"
                                    y="0.75"
                                    width="6.5"
                                    height="2.5"
                                    rx="0.25"
                                    fill="none"
                                />
                            </g>
                        </g>
                    </g>
                    <g transform="translate(-512 1856)">
                        <g transform="translate(0 -1)">
                            <rect
                                width="1.5"
                                height="1.5"
                                transform="translate(-12863 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                            <rect
                                width="7.5"
                                height="1.5"
                                transform="translate(-12860 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                        </g>
                        <g transform="translate(0 2)">
                            <rect
                                width="1.5"
                                height="1.5"
                                transform="translate(-12863 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                            <rect
                                width="7.5"
                                height="1.5"
                                transform="translate(-12860 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                        </g>
                        <g transform="translate(0 5)">
                            <rect
                                width="1.5"
                                height="1.5"
                                transform="translate(-12863 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                            <rect
                                width="7.5"
                                height="1.5"
                                transform="translate(-12860 -1921)"
                                fill={
                                    props.active ? active_color : normal_color
                                }
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

BottomNavOrderList.defaultProps = {
    active: false,
};
export default BottomNavOrderList;
