import { createAction, handleActions } from 'redux-actions';

const OPEN = 'scroll/OPEN';
const CLOSE = 'scroll/CLOSE';

export const scrollOpen = createAction(
    OPEN,
    target => target,
);

export const scrollClose = createAction(
    CLOSE,
    target => target,
);

const initialState = {
    header: false
}

const scroll = handleActions(
    {
        [OPEN]: (state, action) => ({
            ...state,
            [action.payload]: true
        }),
        [CLOSE]: (state, action) => ({
            ...state,
            [action.payload]: false
        })
    },
    initialState
);

export default scroll;