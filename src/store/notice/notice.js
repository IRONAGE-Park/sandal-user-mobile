import { createAction, handleActions } from 'redux-actions';

const GET_NOTICE = 'notice/GET_NOTICE'; //알림 가져오기
const REMOVE_NOTICE = 'notice/REMOVE_NOTICE'; //알림 삭제
const READ_NOTICE = 'notice/READ_NOTICE'; // 알림 읽기
const READ_ALL_NOTICE = 'notcie/READ_ALL_NOTICE'; //알림 전체읽기
const CHECK = 'notice/CHECK'; //남은 알림이 있는지 체크
const INIT = 'notice/INIT'; //알림스토어 초기화

export const get_notice = createAction(GET_NOTICE);
export const remove_notice = createAction(REMOVE_NOTICE);
export const read_notice = createAction(READ_NOTICE);
export const read_all_notice = createAction(READ_ALL_NOTICE);
export const read_check = createAction(CHECK);
export const init = createAction(INIT);

const initState = {
    notification: [],
    notice_check: false,
};

const notice = handleActions(
    {
        [GET_NOTICE]: (state, action) => {
            return {
                ...state,
                notification: state.notification.concat(action.payload),
            };
        },
        [REMOVE_NOTICE]: (state, action) => ({
            ...state,
            notification: state.notification.filter(
                (item) => item.not_id !== action.payload,
            ),
        }),
        [READ_NOTICE]: (state, action) => {
            const { notification } = state;
            const { not_id, not_read_datetime } = action.payload;
            const newState = notification.map((item) =>
                item.not_id === not_id
                    ? { ...item, not_read_datetime: not_read_datetime }
                    : item,
            );
            return {
                ...state,
                notification: newState,
            };
        },
        [READ_ALL_NOTICE]: (state, action) => {
            const { notification } = state;
            const {
                // not_id,
                not_read_datetime
            } = action.payload;
            const newState = notification.map((item) => ({
                ...item,
                not_read_datetime: not_read_datetime,
            }));
            return {
                ...state,
                notification: newState,
            };
        },
        [CHECK]: (state, action) => ({
            ...state,
            notice_check: action.payload,
        }),

        [INIT]: (state, action) => ({
            notification: [],
            notice_check: false,
        }),
    },
    initState,
);

export default notice;
