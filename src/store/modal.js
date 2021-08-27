import { createAction, handleActions } from 'redux-actions';

const OPEN = 'modal/OPEN';
const CLOSE = 'modal/CLOSE';

export const modalOpen = createAction(
    OPEN,
    (confirm, title, text, handleClick,handleClose) => ({
        confirm,
        title,
        text,
        handleClick,
        handleClose,
    }),
);

export const modalClose = createAction(CLOSE, (form) => form);

const initialState = {
    open: false,
    confirm: false,
    title: '창입니다.',
    text: '내용입니다.',
    handleClick: () => {},
    handleClose:()=>{},
};

const modal = handleActions(
    {
        [OPEN]: (state, action) => {
            const { confirm, title, text, handleClick,handleClose } = action.payload;
            return {
                ...state,
                open: true,
                confirm,
                title,
                text,
                handleClick,
                handleClose,
            };
        },
        [CLOSE]: (state, action) => ({
            ...state,
            open: false,
        }),
    },
    initialState,
);

export default modal;
