import axios from 'axios';
import { Paths } from '../../paths';

export const requestEventPost = async (id) => {
    const req = Paths.api + 'user/event/show';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            event_id: id
        }
    }
    const res = await axios.get(req, config);
    return res;
}

export const requestEventList = async (offset=0,limit=1000) => {
    const req = `${Paths.api}user/event/list`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            offset, limit
        }
    };
    const res = await axios.get(req,config);
    return res;
};
