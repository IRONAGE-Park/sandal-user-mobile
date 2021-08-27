import React, { useEffect, useState } from 'react';
import NoImage from '../svg/sign/profile.png';

export default ({ size = 72, src, alt }) => {
    const [imageSrc, setImageSrc] = useState(src);
    useEffect(() => setImageSrc(src), [src]);
    return (
        <>
            {(src !== '[]' && src.length !== 0 ) ? <img
                src={imageSrc}
                alt={alt}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                }}
                onError={() => setImageSrc(NoImage)}
            /> : <img src={NoImage} alt="noimage" />}
        </>
    );
};
