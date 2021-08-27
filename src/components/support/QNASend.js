import React, { useCallback } from 'react';
import classNames from 'classnames/bind';
import { Button, ButtonBase } from '@material-ui/core';
import styles from './QNASend.module.scss';

const cn = classNames.bind(styles);

const QNASend = ({ state, onChange, files, setFiles, onSubmit, isUpdate }) => {
    const { title, content, email } = state;

    const onChangeFiles = useCallback(
        (e) => {
            const { files: f } = e.target;
            const fileArray = [];
            for (let i = 0; i < f.length; i++) {
                fileArray.push(f[i]);
            }
            setFiles(fileArray);
        },
        [setFiles],
    );

    return (
        <div className={styles['content']}>
            <div className={styles['input-area']}>
                <input
                    className={styles['input-box']}
                    name="title"
                    placeholder="제목"
                    value={title}
                    onChange={onChange}
                />
            </div>
            <div className={styles['input-area']}>
                <textarea
                    className={cn('input-box', 'textarea-box')}
                    name="content"
                    placeholder="문의하실 내용을 기입해 주세요."
                    value={content}
                    onChange={onChange}
                />
            </div>
            <div className={styles['input-area']}>
                <input
                    className={styles['input-box']}
                    name="email"
                    placeholder="답변 받을 이메일 주소"
                    email={email}
                    onChange={onChange}
                />
            </div>
            <div className={styles['input-area']}>
                <input
                    className={styles['input-file']}
                    multiple="multiple"
                    type="file"
                    onChange={onChangeFiles}
                    id="file-setter"
                    accept="image/gif, image/jpeg, image/png, image/svg"
                />
                <ButtonBase
                    component="label"
                    htmlFor="file-setter"
                    className={styles['input-box']}
                    placeholder="첨부파일 추가"
                >
                    {files.length === 0 ? (
                        <p className={styles['file-button']}>첨부파일 추가</p>
                    ) : (
                        <div className={styles['file-list']}>
                            {files.map((file) => (
                                <p key={file.name}>{file.name}</p>
                            ))}
                        </div>
                    )}
                </ButtonBase>
            </div>
            <div className={styles['submit-area']}>
                <Button onClick={onSubmit}>
                    <div className={styles['submit']}>
                        {isUpdate ? '수정하기' : '문의하기'}
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default QNASend;
