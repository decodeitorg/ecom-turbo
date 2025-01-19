import sslcz from "@/utils/payment/sslCommerz.ts";

import type { OrderType } from "./types.ts";

export const generatePaymentLink = async (order: OrderType) => {
    const {
        userName,
        phoneNumber,
        userEmail,
        shippingFeeAdvanceForCashOnDelivery,
        totalPayableWhileDelivery,
        paymentMethod,
        city,
        address,
        note,
    } = order;

    const paymentData = {
        //Integration Required Parameters
        total_amount:
            paymentMethod === "cashOnDelivery"
                ? shippingFeeAdvanceForCashOnDelivery
                : totalPayableWhileDelivery,
        currency: "BDT",
        tran_id: order?._id.toString(),
        success_url:
            import.meta.env.PUBLIC_SITE + "/api/frontend/payment/ssl/success",
        fail_url:
            import.meta.env.PUBLIC_SITE + "/api/frontend/payment/ssl/fail",
        cancel_url:
            import.meta.env.PUBLIC_SITE + "/api/frontend/payment/ssl/cancel",
        //   ipn_url: import.meta.env.PUBLIC_SITE + '/api/frontend/payment/ssl/ipn',
        // Parameters to Handle EMI Transaction
        emi_option: 1,
        //Customer Information
        cus_name: userName || "Customer",
        cus_email: userEmail || "liketelecombashundhara@gmail.com",
        cus_add1: address,
        cus_city: city,
        cus_postcode: Math.floor(1000 + Math.random() * 9000).toString(),
        cus_country: "Bangladesh",
        cus_phone: phoneNumber,
        //Shipment Information. Required For SSLCOMMERZ_LOGISTIC
        shipping_method: "NO", //then Shipment Information/address not necessary."
        //Product Information
        product_name: order?._id.toString(),
        product_category: "Mobile/Accessories",
        product_profile: "general",
        //Customized or Additional Parameters
        //value_a: ... a to d
    };

    let responseSSL = await sslcz.init(paymentData);

    if (responseSSL?.GatewayPageURL) {
        return responseSSL.GatewayPageURL;
    } else return false;
};
