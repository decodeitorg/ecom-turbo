import Setting from '@/models/Setting.ts';
import SSLCommerzPayment from 'sslcommerz-lts';

let setting = await Setting.findOne();
const sslCommerz = setting?.sslCommerz;

const store_id = sslCommerz?.storeId;
const store_passwd = sslCommerz?.storePassword;
const is_live = sslCommerz?.isLive;

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

export default sslcz;
