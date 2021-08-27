import axios from 'axios';
import { Paths } from '../../paths';

const URL = 'https://www.juso.go.kr/addrlink/addrLinkApi.do';
const KEY = 'U01TX0FVVEgyMDIwMTIyMjE1NTUyMjExMDU4MDU=';

const OPTIONS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 10000,
};

export const getDeliveryList = async (token) => {
    const req = `${Paths.api}user/delivery/list`;

    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }

    const res = await axios.get(req,config);
    return res;
};
export function getCoordinates() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, OPTIONS);
    });
}


export const insertAddress = async (
    token,
    post_num,
    addr1,
    addr2,
    extra,
    lat,
    lng,
) => {
    const req = Paths.api + `user/delivery`;

    const form_data = {
        post_num: post_num,
        addr1: addr1,
        addr2: addr2,
        extra: 0,
        lat: lat,
        lng: lng,
    };
    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.post(req,form_data,config);
    return res;
};


export const selectAddress = async (token, delivery_id) => {
    const req = Paths.api + 'user/delivery/update';
    const form_data = {
        delivery_id: delivery_id,
    };

    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.put(req, form_data,config);
    return res;
};


export const getActiveAddr = async (token) => {
    const req = `${Paths.api}user/delivery/list`;

    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }

    const res = await axios.get(req,config);

    const { query } = res.data;
    let len = Object.keys(query).length;
    for (let i = 0; i < len; i++) {
        if (query[i].active === 1) {
            const { addr1, addr2, lat, lng, post_num } = query[i];
            return { addr1, addr2, lat, lng, post_num };
        }
    }
    return null;
};



export const deleteAddr = async (token, delivery_id) => {

    const req = Paths.api + 'user/delivery/delete';
    const form_data = { delivery_id };
    const config ={
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    }
    const res = await axios.delete(req, {
        data: form_data,
        headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type' :'application/json',
        }
    });
    return res;
};

export const searchAddress = async (searchAddr) => {

    const req = URL;
    const config ={
        params:{
            confmKey : KEY,
            currentPage:1,
            countPerPage:10,
            keyword:searchAddr,
            resultType:'json'
        },
        headers:{
           Accept: "application/json, text/plain, */*",
        }
    }

    const res = await axios.get(req,config);

    return res.data.results.juso;

};



export const requsetGetAreaInfo = async (lat, lng) => {
    const URL = 'https://dapi.kakao.com/v2/local/geo/coord2address.json';
    const response = await axios.get(URL, {
        headers: {
            Authorization: `KakaoAK 273633787faa10f532cc43b5ab3ab407`,
        },
        params: {
            y: lat,
            x: lng,
        },
    });
    return response;
};