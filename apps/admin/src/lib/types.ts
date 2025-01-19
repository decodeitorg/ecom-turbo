export interface Attribute {
    _id: string;
    category_id: string;
    name: string;
    type: string;
    slug: string;
    status: string;
    variants: {
        name: string;
        _id: string;
        value: number;
    }[];
}

export type ProductVariant = {
    [key: string]: string; // _id of Attribute and _id of Variant
} & {
    price: number;
    salePrice: number;
    id: number;
    images: string[];
    status: string;
    extraDeliveryCharge: number;
    stock: number;
    CartItemsType: CartItemsType;
}; // Fixed part with product properties

//add product formik
export interface Product {
    name: string;
    slug: string;
    shortDescription: string;
    useYoutube: boolean;
    youtubeLink: string;
    description: string;
    faq: {
        question: string;
        answer: string;
    }[];
    category: string;
    subCategory: string;
    leafCategory: string;
    images: string[]; // Assuming images are URLs or paths
    price: number;
    salePrice: number;
    isHomeDeliveryFree: boolean;
    hasStock: boolean;
    stock: number;
    hasVariants: boolean;
    variants: ProductVariant[];
    variantsAttributes: {
        [key: string]: string[];
    }; //All the id of Attributes from which variants are created
    imageVariant: {
        type: "same" | "different";
        variantId: string;
    };
    status: string;
}

export type TokenType = {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    phone: {
        number: string;
        verified: boolean;
        otp: string;
    };
};

export type CartItemsType = {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    salePrice: number;
    status: string;
    quantity: number;
    hasVariant: boolean;
    variant: ProductVariant;
    variant_id: number;
    nameOfVariant: string;
};

export type CartType = {
    user?: string;
    userImage?: string;
    userName: string;
    phoneNumber: string;
    userEmail?: string;

    city: string;
    address: string;
    note: string;

    isPaymentEnabled: boolean;
    paymentMethod: "cashOnDelivery" | "onlinePayment";
    isHomeDeliverySelected: boolean;
    total: number;
    shippingCost: number;
    inTotal: number;
    shippingFeeAdvanceForCashOnDelivery: number;
    totalPayableWhileDelivery: number;
    totalExtraDeliveryCharge: number;

    takeShippingFeeAdvance?: boolean;
    cartItems: CartItemsType[];
};

export type OrderType = CartType & {
    _id: string;

    fraudStatus: object;

    status: "pending" | "processing" | "delivered" | "onDelivery" | "cancelled";
    paymentStatus: "pending" | "success" | "failed";
    refundStatus: "processing" | "failed" | "success" | "";
    paymentLink: string;
    ssl: {
        bank_tran_id: string;
        refund_ref_id: string;
    };
    steadFast: {
        consignment_id: number;
        tracking_code: string;
        status:
            | "pending"
            | "delivered_approval_pending"
            | "partial_delivered_approval_pending"
            | "cancelled_approval_pending"
            | "unknown_approval_pending"
            | "delivered"
            | "partial_delivered"
            | "cancelled"
            | "hold"
            | "in_review"
            | "unknown";
        statusDescription: string;
    };
};

export type VariantUnwindedProductType = {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    status: string;
    salePrice: number;
    hasVariants: boolean;
    variants: any;
    variantsAttributes: Attribute[];
};

export type FrontendObjType = {
    _id?: string;
    name?: string;
    logo?: string;
    description?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    email?: string;
    address?: string[];
    phoneNumber?: string[];
    aboutUs?: string;
    customeService?: string;
    privacyPolicy?: string;
    termsAndConditions?: string;
    heroCarousel?: {
        image: string;
        alt: string;
        link: string;
    }[];
    campaignImages?: {
        image: string;
        alt: string;
        link: string;
    }[];
    featureBanner?: {
        image: string;
        alt: string;
        link: string;
    };
    customerReviewImages?: {
        image: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type CategoryType = {
    _id: string;
    name: string;
    parentId?: string;
    icon: string;
    status: string;
    attribute: string[];
    attributeType: "same_as_parent" | "unique" | "extend_parent";
    children: CategoryType[];
};
