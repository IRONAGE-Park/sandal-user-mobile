import axios from 'axios';
import { Paths } from '../../paths';

//지점 검색
export const getStoreList = async (search, offset, limit) => {
    const req = Paths.api + 'user/shop/list';

    const config = {
        headers:{
            'Context-Type' : 'application/json'
        },
        params: {
            search,
            limit,
            offset,
        },
    };

    const res = await axios.get(req, config);
    return res;
};

export const getNearStore = async (token, lat, lng, addr1) => {
    const req = Paths.api + 'user/delivery/select';

    const config = {
        headers:{
            'Context-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`,
        },
        params: {
            lat,
            lng,
            addr1,
        },
    };

    const res = await axios.get(req, config);
    return res;
};
