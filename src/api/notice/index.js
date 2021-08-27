import axios from 'axios';
import { Paths } from '../../paths';

export const reqNoticeList = async (token) => {
    const req = Paths.api + 'user/notification/list?offset=&limit=';
    const config = {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};

export const reqNoticeRead = async (token, not_id) => {
    const req = Paths.api + 'user/notification/read';
    const form_data = {
        not_id: not_id,
    };
    const config={
        hedaers:{
            'Content-Type' : 'application/json',
            'Authorization':  `Bearer ${token}`
        }
    }
    const res = await axios.put(req, form_data,config);
    return res;
};

export const reqNoticeReadAll = async (token) => {
    const req = Paths.api + 'user/notification/read_all';

    const config={
        hedaers:{
            'Content-Type' : 'application/json',
            'Authorization':  `Bearer ${token}`
        }
    }


    const res = await axios.put(req,config);
    return res;
};

export const reqNoticeDelete = async (token, not_id) => {
    const req = Paths.api + 'user/notification/delete';
    const form_data = { not_id };

    const res = await axios.delete(req, {
        data: form_data,
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    });

    return res;
};
