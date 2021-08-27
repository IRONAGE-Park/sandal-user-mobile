import { combineReducers } from 'redux';
import auth, { auth_saga } from './auth/auth';
import company ,{company_saga} from './company';
import { product, bestmenu, breakfast ,prefer} from './product';

import { address, store } from './address';
import notice from './notice/notice';
import modal from './modal';
import scroll from './scroll';

import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
    auth,
    product,
    bestmenu,
    breakfast,
    prefer,
    address,
    store,
    modal,
    notice,
    scroll,
    company,
});

export function* rootSaga() {
    yield all([auth_saga(),company_saga()]);
}

export default rootReducer;
