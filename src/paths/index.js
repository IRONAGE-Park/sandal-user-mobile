export const PROTOCOL_ENV = 'https://'

export const Paths = {
    index: '/',
    ajoonamu: {
        signin: '/login',
        signup: '/signup',
        recovery: '/recovery',
        recovery_id: '/recovery_id',
        recovery_pw: '/recovery_pw',
        complete: '/complete',
        find_email :'/find_email',
        find_password : '/find_password',
        shop: '/shop',
        breakfast: '/breakfast',
        product:'/product',
        mypage: '/mypage',
        account: '/account',
        update_name: '/update_name',
        update_phone: '/update_phone',
        update_password: '/update_password',
        address: '/address',
        cart: '/cart',
        order: '/order',
        order_list: '/order_list',
        order_detail:'/order_detail',
        order_complete :'/order_complete',
        order_review: '/order_review',
        coupon: '/coupon',
        support: '/support',
        notice: '/notice',
        event: '/event',
        tos :'/tos',
        oauth:'/oauth'
    },
    api: PROTOCOL_ENV + 'api.ajoonamu.com/api/',
    storage: PROTOCOL_ENV + 'api.ajoonamu.com/storage/'
};
