import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

const GET_MENULIST = 'bestmenu/GET_MENULIST';
const GET_CATEGORY = 'bestmenu/GET_CATEGORY';
const ADD_MENUITEM = 'bestmenu/ADD_MENUITEM';
const POST_INDEX = 'bestmenu/POST_INDEX';

export const get_best_cate = createAction(GET_CATEGORY);
export const get_best_menu = createAction(GET_MENULIST);
export const add_best_menu = createAction(ADD_MENUITEM);
export const post_index = createAction(POST_INDEX);

const initState = {
    items: null,
    categorys:[],
    index:0,
};

const bestmenu = handleActions(
    {

        [POST_INDEX] : (state,action) =>({
            ...state,
            index : action.payload
        }),
        [GET_CATEGORY]: (state, action) => {
            return{
            ...state,
            categorys: state.categorys.concat(action.payload),
            }
        },
        [GET_MENULIST]: (state, action) => ({
            ...state,
            items: action.payload,
        }),
        [ADD_MENUITEM]: (state, action) => {
            const { items } = state;
            const ca_id = action.payload.ca_id;
            const index = items.findIndex((item) => item.ca_id === ca_id);

            //하나의 카테고리에 같은 메뉴가 있으면 안되니 그걸로 중복 판단.
            const item_id = action.payload.items[0].item_id;
            const isPush = items[index].items.findIndex(
                (item) => item.item_id === item_id,
            );
            if (isPush === -1) {
                const newState = produce(items, (draft) => {
                    draft[index].items = draft[index].items.concat(
                        action.payload.items,
                    );
                });
                return {
                    ...state,
                    items: newState,
                };
            } else {
                return state;
            }
        },
    },
    initState,
);

export default bestmenu;
