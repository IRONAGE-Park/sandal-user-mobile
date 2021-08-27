import axios from 'axios';
import { Paths } from '../../paths';

export const getPreferMenuList = async (
    general_offset = 0,
    general_limit = 100,
    prefer_offset = 0,
    prefer_limit = 100,
    item_type = 1,
    budget,
    desire_quan,
    addr1,
    shop_id,
) => {
    const req = Paths.api + `user/item/prefer`;

    const config = {
        params: {
            general_offset,
            general_limit,
            prefer_offset,
            prefer_limit,
            item_type,
            budget,
            desire_quan,
            addr1,
            shop_id,
        },
        headers:{
            'Content-Type': 'application/json'
        }
    };
    const result = await axios.get(req, config);
    return result.data.query;
};



export const getMenuList = async (ca_id, offset = 0, limit = 8, shop_id) => {
    const req = Paths.api + 'user/item/list';
 

    const config = {
        params: {
            ca_id,
            limit,
            offset,
            shop_id,
        },
        headers:{
            'Content-Type': 'application/json'
        }
    };

    const result = await axios.get(req, config);
    return result;
};

export const getMainMenuList = async (ca_id = 1, offset = 0, limit = 8) => {
    const req = Paths.api + 'user/item/main';

    const config = {
        headers:{
            'Content-Type': 'application/json'
        },
        params: {
            ca_id,
            limit,
            offset,
        },
    };
    const result = await axios.get(req, config);
    return result;
};

export const getMenuInfo = async (item_id) => {
    const req = Paths.api + `user/item/view?offset&limit&item_id=${item_id}`;
    const config = {
        headers: {
            'content-type': 'application/json',
        },
    };
    const result = await axios.get(req, config);
    return result.data.query;
};
