import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { ButtonBase, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { requestGetReviewView, requestPostReviewStore, requestPostReviewUpdate } from '../../api/review/review';
import Loading from '../../components/asset/Loading';
import Star from '../../components/svg/order/Star';
import Delete from '../../components/svg/order/Delete';
import { useModal } from '../../hooks/useModal';
import { useStore } from '../../hooks/useStore';
import { Paths } from '../../paths';

import styles from './OrderReview.module.scss';

const cn = classnames.bind(styles);


const OrderReviewImageItem = ({ file, handleDeleteFile }) => {
    const [imageFile, setImageFile] = useState(null);


    useEffect(() => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64 = reader.result;
            if (base64) {
                setImageFile(base64.toString());
            }
        }
        reader.readAsDataURL(file);
    }, [file]);

    return (
        <>{imageFile &&
            <div className={styles['file-item']}>
                <div className={styles['file-image']} style={{ backgroundImage: 'url(' + imageFile + ')' }} alt="" />
                <IconButton className={styles['delete']} onClick={handleDeleteFile}>
                    <Delete />
                </IconButton>
            </div>}
        </>
    );
}

const OrderReviewContainer = ({ review_id, order_id }) => {

    const user_token = useStore(true);
    const openModal = useModal();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [rate, setRate] = useState(5.0);


    const onChangeContent = useCallback(e => setContent(e.target.value), []);
    const onDeleteFile = useCallback(name => setFiles(files => files.filter(file => file.name !== name)), []);
    const onChangeFiles = useCallback(e => {
        const { files: f } = e.target;
        const fileArray = [];
        for (let i = 0; i < f.length; i++) {
            fileArray.push(f[i]);
        }
        setFiles(fileArray);
    }, []);

    const getReviewContent = useCallback(async () => {
        if (review_id) {
            setLoading(true);
            try {
                const res = await requestGetReviewView(review_id);
                if (res.data.msg === '성공') {
                    const { review_body, review_rating } = res.data.query.review;
                    setContent(review_body);
                    setRate(parseFloat(review_rating));
                } else {
                    openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
                    history.push(Paths.ajoonamu.mypage + '/order_list');
                }
            } catch (e) {
                openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
                history.push(Paths.ajoonamu.mypage + '/order_list');
            }
            setLoading(false);
        }
    }, [review_id, openModal, history]);

    const sendReviewStore = useCallback(async () => {
        if (files.length && content.length) {
            setLoading(true);
            try {
                const res = await requestPostReviewStore(user_token, {
                    order_id: order_id,
                    review_body: content,
                    review_rating: rate,
                    review_images: files
                });
                if (res.data.msg === '성공') {
                    openModal('성공적으로 작성하였습니다!', '리뷰를 작성해주셔서 감사합니다!', () => {
                        window.location.replace(`${Paths.ajoonamu.order_list}`);
                    });
                } else if (res.data.msg === '이미 해당 주문번호에 작성된 리뷰가 존재') {
                    openModal('이미 해당 주문번호에 작성된 리뷰가 존재합니다.', '주문 번호를 다시 한 번 확인해 주세요.');
                } else {
                    openModal('작성하는 도중 오류가 발생했습니다!', '다시 시도해 주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
                history.push(Paths.ajoonamu.order_list);
            }
            setLoading(false);
        } else {
            openModal('내용이 부족합니다.', '사진 및 리뷰 내용을 모두 작성하셔야 합니다.');
        }
    }, [user_token, order_id, content, rate, files, openModal, history]);

    const sendReviewUpdate = useCallback(async () => {
        if (files.length && content.length) {
            setLoading(true);
            try {
                const res = await requestPostReviewUpdate(user_token, {
                    review_id,
                    review_body: content,
                    review_rating: rate,
                    review_images: files
                });
                if (res.data.msg === '성공') {
                    openModal('성공적으로 수정하였습니다!', '리뷰를 작성해주셔서 감사합니다!', () => {
                        window.location.replace(`${Paths.ajoonamu.order_list}`);
                    });
                } else if (res.data.msg === '해당 review_id에 권한없거나 존재하지 않는 review_id') {
                    openModal('수정할 수 없는 리뷰입니다!', '작성한 아이디를 다시 확인해 주세요.');
                } else {
                    openModal('수정하는 도중 오류가 발생했습니다!', '다시 시도해 주세요.');
                }
            } catch (e) {
                openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
                history.push(Paths.ajoonamu.order_list);
            }
            setLoading(false);
        } else {
            openModal('내용이 부족합니다.', '사진 및 리뷰 내용을 모두 작성하셔야 합니다.');
        }
    }, [user_token, review_id, content, rate, files, openModal, history]);

    useEffect(() => {
        if (!order_id && !review_id) {
            openModal('조회할 수 없는 리뷰입니다!', '리뷰 번호나 주문 번호를 다시 확인해 주세요.');
            history.push(Paths.index);
        }
    }, [order_id, review_id, history, openModal]);

    useEffect(() => {
        getReviewContent();
    }, [getReviewContent]);

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['table']}>
                    <div className={styles['rate-box']}>
                        <p className={styles['title']}>고객님의 만족도</p>
                        <div className={styles['rate']}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} clip={star > rate} size={40} onClick={() => setRate(star)} />
                            ))}
                        </div>
                    </div>
                    <textarea className={styles['r-content']} value={content} onChange={onChangeContent} placeholder="고객님께서 받아보셨던 상품에 대한 리뷰를 적어주세요." />
                    <div className={styles['file']}>
                        <input className={styles['q-files']} multiple="multiple" type="file" onChange={onChangeFiles} id="file-setter" accept="image/gif, image/jpeg, image/png, image/svg" formEncType="multipart/form-data" />
                        <ButtonBase component="div" className={styles['file-finder']}>
                            <label className={styles['file-setter']} htmlFor="file-setter">
                                <div className={styles['font']}>
                                    + 찾아보기
                                </div>
                            </label>
                        </ButtonBase>
                    </div>
                    <div className={styles['file-list']}>
                        {files.map(file => (
                            <OrderReviewImageItem key={file.name} file={file} handleDeleteFile={() => onDeleteFile(file.name)} />
                        ))}
                    </div>
                    <div className={styles['button-area']}>
                        <ButtonBase className={styles['confirm-button']} onClick={review_id ? sendReviewUpdate : sendReviewStore}>
                            {review_id ? '수정 완료' : '등록 완료'}
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <Loading open={loading} />
        </>
    );
};

export default OrderReviewContainer;
