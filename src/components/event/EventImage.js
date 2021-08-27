import React from 'react';
import styles from './EventContent.module.scss';
import ErrorCoverImage from '../asset/ErrorCoverImage';

export default ({ image }) => image ? <ErrorCoverImage className={styles['image']} src={image} alt="event_image" /> : null;