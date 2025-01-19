interface ValidationParams {
  userName: string;
  phoneNumber: string;
  checkBox: boolean;
  city: string;
  address: string;
  note: string;
  cartItems: any[]; // Replace 'any' with the actual type of the cart items
  paymentMethod: 'cashOnDelivery' | 'onlinePayment';
}

export const userAddressAndPaymentMethodValidation = ({
  userName,
  phoneNumber,
  checkBox,
  city,
  address,
  note,
  cartItems,
  paymentMethod,
}: ValidationParams): string | boolean => {
  if (!userName) {
    return 'User name is required.';
  }

  //   let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (userEmail && !emailRegex.test(userEmail)) {
  //     return 'Email is invalid.';
  //   }

  if (!address || !city) {
    return 'Address and city is required.';
  }

  const regex = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

  if (!phoneNumber || !regex.test(phoneNumber)) {
    return 'Phone number is invalid.';
  }

  if (!checkBox) {
    return 'Checkbox must be checked.';
  }

  if (cartItems?.length === 0) {
    return 'Cart is empty.';
  }

  if (paymentMethod !== 'cashOnDelivery' && paymentMethod !== 'onlinePayment') {
    return 'Invalid payment method.';
  }

  if (note) {
    //sanitization - take only ., a-z, A-Z, 0-9, space
    const regex = /^[.,a-zA-Z0-9 ]*$/;
    note.replace(regex, '');
  }

  return false;
};
