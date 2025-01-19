/**
 * Generates a payload for a product object from database
 * selectedVariants - store the current selected product variant
 *
 * this function returns a payload object for the cart object based on the current selected product variant
 */
function cartProductPayloadGeneration(product, selectedVariants, quantity) {
  function generateVariantQueryStringAndName(variant, attributes) {
    let url = '';
    let nameOfVariant = '';
    let keys = Object.keys(variant);
    let populated = keys.forEach((key, index) => {
      if (key.length === 24) {
        let attribute = attributes?.find((item) => {
          return item._id.toString() === key;
        });
        if (attribute?.variants?.length > 0) {
          let keyVal = variant[key];
          let filterVariant = attribute.variants.find((item) => {
            return item._id.toString() === keyVal;
          });

          if (index === 0) {
            url = `?${encodeURIComponent(attribute.name)}=${encodeURIComponent(filterVariant.name)}`;
            nameOfVariant = filterVariant.name;
          } else {
            url += `&${encodeURIComponent(attribute.name)}=${encodeURIComponent(filterVariant.name)}`;
            nameOfVariant += ` ${filterVariant.name}`;
          }
        }
      }
    });
    return {
      url,
      nameOfVariant: nameOfVariant ?? '',
    };
  }

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product?.hasVariants
      ? product?.variants[0]?.images[0]
      : product?.images[0],
    price: !product?.hasVariants ? product.price : selectedVariants.price,
    salePrice: !product?.hasVariants
      ? product.salePrice
      : selectedVariants.salePrice,
    isHomeDeliveryFree: !product?.hasVariants
      ? product.isHomeDeliveryFree
      : selectedVariants.isHomeDeliveryFree,
    status: !product?.hasVariants ? product.status : selectedVariants.status,
    quantity: quantity ?? 1,
    hasVariant: product.hasVariants,
    variant: product.hasVariants ? selectedVariants : null,
    variant_id: product.hasVariants ? selectedVariants.id : '',
    nameOfVariant: product.hasVariants
      ? generateVariantQueryStringAndName(
          selectedVariants,
          product?.variantsAttributes,
        )?.nameOfVariant
      : '',
  };
}

function handleBuyNow(product, selectedVariants, quantity) {
  console.log('🚀 ~ handleBuyNow ~ product:', product);
  let cartProductPayload = cartProductPayloadGeneration(
    product,
    selectedVariants,
    quantity,
  );
  console.log('🚀 ~ handleBuyNow ~ cartProductPayload:', cartProductPayload);
  let status = product?.hasVariants
    ? selectedVariants?.status
    : product?.status;

  if (status !== 'inStock') {
    errorAlert(`Product is ${statusText[status]}`);
    return;
  }

  localStorage.setItem(
    'cart',
    JSON.stringify([
      {
        ...cartProductPayload,
      },
    ]),
  );
  window.location.href = '/cart';
}

const statusText = {
  upcoming: 'Upcomming',
  inStock: 'In Stock',
  outOfStock: 'Out of Stock',
};

function handleAddToCart(product, selectedVariants, quantity) {
  if (quantity < 1) return errorAlert('Select a quantity to add to cart');
  let cartProductPayload = cartProductPayloadGeneration(
    product,
    selectedVariants,
    quantity,
  );
  let status = product?.hasVariants
    ? selectedVariants?.status
    : product?.status;

  if (status !== 'inStock') {
    errorAlert(`Product is ${statusText[status]}`);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) ?? [];

  //first check if product hasVariant
  if (!cartProductPayload.hasVariant) {
    let productIndex = cart.findIndex((item) => {
      return item._id === cartProductPayload._id;
    });

    //if not then add the product to the cart
    if (productIndex === -1) {
      cart.push({
        ...cartProductPayload,
      });
    } else {
      cart[productIndex].quantity += quantity;
    }
  } else {
    //if yes then check if the selected variant already exists in the cart
    let productIndex = cart.findIndex((item) => {
      return (
        item._id === cartProductPayload._id &&
        item.variant_id === cartProductPayload.variant_id
      );
    });

    //if not then add the product to the cart
    if (productIndex === -1) {
      cart.push({
        ...cartProductPayload,
        quantity,
      });
    } else {
      cart[productIndex].quantity += quantity;
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  const event = new Event('cartItemChange');
  document.dispatchEvent(event);
  successAlert('Item added to cart successfully');

  // Optionally trigger the `AddToCart` event for tracking
  trackAddToCartEvent(cartProductPayload, quantity);
}

function clearCart() {
  localStorage.setItem('cart', JSON.stringify([]));
  const event = new Event('cartItemChange');
  document.dispatchEvent(event);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
function getEventIdUnique() {
  return (
    new Date().getTime().toString() +
    Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(6, '0')
  );
}

function trackAddToCartEvent(productPayload, quantity) {
  if (window.fbq) {
    const eventID = getEventIdUnique();
    fbq(
      'track',
      'AddToCart',
      {
        content_ids: [productPayload.slug],
        content_type: 'product',
        contents: [{ id: productPayload.slug, quantity: quantity }],
        value: Number((productPayload.salePrice * quantity).toFixed(2)),
        currency: 'BDT',
      },
      { eventID },
    );

    // Send POST request to server-side event tracking API
    fetch('/api/frontend/fb_conversion_api/AddToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productData: {
          content_ids: [productPayload.slug],
          content_type: 'product',
          contents: [{ id: productPayload.slug, quantity: quantity }],
          value: Number((productPayload.salePrice * quantity).toFixed(2)),
          currency: 'BDT',
        },
        userData: {
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
        },
        eventID,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('AddToCart server event sent:', data))
      .catch((error) =>
        console.error('Error sending AddToCart server event:', error),
      );
  }
}

async function trackViewContentEvent(viewContentPayload) {
  const eventID = getEventIdUnique();
  try {
    if (window.fbq) {
      let s = fbq('track', 'ViewContent', viewContentPayload, {
        eventID,
      });
    }

    const response = await fetch(
      '/api/frontend/fb_conversion_api/ViewContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productData: viewContentPayload,
          userData: {
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
          },
          eventID,
        }),
      },
    );
    const data = await response.json();
    console.log('View Content Server event sent:', data);
  } catch (error) {
    console.error('Error sending server event:', error);
  }
}
function trackCustomizeProduct(customizeProductPayload) {
  const eventID = getEventIdUnique();

  if (window.fbq) {
    let s = fbq('track', 'CustomizeProduct', customizeProductPayload, {
      eventID,
    });
  }

  fetch('/api/frontend/fb_conversion_api/CustomizeProduct', {
    method: 'POST',
    body: JSON.stringify({
      productData: customizeProductPayload,
      userData: {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      },
      eventID,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Customize Product Server event sent:', data))
    .catch((error) => console.error('Error sending server event:', error));
}
function trackInitiateCheckoutEvent(productPayload) {
  if (window.fbq) {
    const eventID = getEventIdUnique();
    fbq(
      'track',
      'InitiateCheckout',
      {
        content_ids: productPayload.content_ids,
        content_type: productPayload.content_type,
        contents: productPayload.contents,
        value: productPayload.value,
        currency: productPayload.currency,
      },
      { eventID },
    );

    // Send POST request to server-side event tracking API
    fetch('/api/frontend/fb_conversion_api/InitiateCheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productData: {
          content_ids: productPayload.content_ids,
          content_type: productPayload.content_type,
          contents: productPayload.contents,
          value: productPayload.value,
          currency: productPayload.currency,
        },
        userData: {
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
        },
        eventID,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log('InitiateCheckout server event sent:', data))
      .catch((error) =>
        console.error('Error sending InitiateCheckout server event:', error),
      );
  }
}
async function trackPurchaseEvent(productPayload) {
  if (window.fbq) {
    try {
      const eventID = getEventIdUnique();
      fbq(
        'track',
        'Purchase',
        {
          content_ids: productPayload.content_ids,
          content_type: productPayload.content_type,
          contents: productPayload.contents,
          value: productPayload.value,
          currency: productPayload.currency,
        },
        { eventID },
      );

      // Send POST request to server-side event tracking API
      let res = await fetch('/api/frontend/fb_conversion_api/Purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productData: {
            content_ids: productPayload.content_ids,
            content_type: productPayload.content_type,
            contents: productPayload.contents,
            value: productPayload.value,
            currency: productPayload.currency,
          },
          userData: {
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
          },
          eventID,
        }),
      });
      const data = { msg: 'success' };
      console.log('Purchase server event sent');

      return data;
    } catch (error) {
      console.error('Error sending Purchase server event:', error);
    }
  }
}

function successAlert(message) {
  const code = `
 <div class="toast active">
    <div class="toast-content">
       <svg height='56px' width='56px' viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#4CAF50"></path><path d="M738.133333 311.466667L448 601.6l-119.466667-119.466667-59.733333 59.733334 179.2 179.2 349.866667-349.866667z" fill="#CCFF90"></path></g></svg>
    <div class="message">
       <span class="text text-1">Success</span>
       <span class="text text-2">${message}</span>
    </div>
    </div>
    <i class="fa-solid fa-xmark close">x</i>
    <div class="progress active"></div>
 </div>
`;

  const body = document.body;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = code;
  body.insertAdjacentElement('afterbegin', wrapper);

  const button = document.querySelector('button');
  const toast = document.querySelector('.toast');
  const closeIcon = document.querySelector('.close');
  const progress = document.querySelector('.progress');

  let toastTimer = setTimeout(() => {
    toast.classList.remove('active');
    progress.classList.remove('active');
  }, 3000);

  closeIcon.addEventListener('click', () => {
    toast.classList.remove('active');
    progress.classList.remove('active');
    clearTimeout(toastTimer);
  });
}
function errorAlert(message) {
  const code = `
 <div class="toast active">
    <div class="toast-content">
 <svg
    height='56px' width='56px'
    xmlns:osb="http://www.openswatchbook.org/uri/2009/osb"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    viewBox="0 0 48 48"
    version="1.1"
    id="svg15"
    sodipodi:docname="cross red circle.svg"
    inkscape:version="0.92.3 (2405546, 2018-03-11)">
 <metadata
    id="metadata19">
    <rdf:RDF>
       <cc:Work
          rdf:about="">
       <dc:format>image/svg+xml</dc:format>
       <dc:type
          rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
       <dc:title />
       </cc:Work>
    </rdf:RDF>
 </metadata>
 <sodipodi:namedview
    pagecolor="#ffffff"
    bordercolor="#666666"
    borderopacity="1"
    objecttolerance="10"
    gridtolerance="10"
    guidetolerance="10"
    inkscape:pageopacity="0"
    inkscape:pageshadow="2"
    inkscape:window-width="1920"
    inkscape:window-height="1027"
    id="namedview17"
    showgrid="false"
    inkscape:zoom="4.9166667"
    inkscape:cx="-11.694915"
    inkscape:cy="40.271186"
    inkscape:window-x="-8"
    inkscape:window-y="-8"
    inkscape:window-maximized="1"
    inkscape:current-layer="g13" />
 <defs
    id="defs7">
    <linearGradient
       id="linearGradient828"
       osb:paint="solid">
       <stop
          style="stop-color:#ff0000;stop-opacity:1;"
          offset="0"
          id="stop826" />
    </linearGradient>
    <linearGradient
       id="0"
       gradientUnits="userSpaceOnUse"
       y1="47.37"
       x2="0"
       y2="-1.429">
       <stop
          stop-color="#c52828"
          id="stop2" />
       <stop
          offset="1"
          stop-color="#ff5454"
          id="stop4" />
    </linearGradient>
 </defs>
 <g
    transform="matrix(.99999 0 0 .99999-58.37.882)"
    enable-background="new"
    id="g13"
    style="fill-opacity:1">
    <circle
       cx="82.37"
       cy="23.12"
       r="24"
       fill="url(#0)"
       id="circle9"
       style="fill-opacity:1;fill:#dd3333" />
    <path
       d="m87.77 23.725l5.939-5.939c.377-.372.566-.835.566-1.373 0-.54-.189-.997-.566-1.374l-2.747-2.747c-.377-.372-.835-.564-1.373-.564-.539 0-.997.186-1.374.564l-5.939 5.939-5.939-5.939c-.377-.372-.835-.564-1.374-.564-.539 0-.997.186-1.374.564l-2.748 2.747c-.377.378-.566.835-.566 1.374 0 .54.188.997.566 1.373l5.939 5.939-5.939 5.94c-.377.372-.566.835-.566 1.373 0 .54.188.997.566 1.373l2.748 2.747c.377.378.835.564 1.374.564.539 0 .997-.186 1.374-.564l5.939-5.939 5.94 5.939c.377.378.835.564 1.374.564.539 0 .997-.186 1.373-.564l2.747-2.747c.377-.372.566-.835.566-1.373 0-.54-.188-.997-.566-1.373l-5.939-5.94"
       fill="#fff"
       fill-opacity=".842"
       id="path11"
       style="fill-opacity:1;fill:#ffffff" />
 </g>
 </svg>        
       <div class="message">
       <span class="text text-1">Error</span>
       <span class="text text-2">${message}</span>
    </div>
    </div>
    <i class="fa-solid fa-xmark close">x</i>
    <div class="progress active bg-red"></div>
 </div>
`;

  const body = document.body;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = code;
  body.insertAdjacentElement('afterbegin', wrapper);

  const button = document.querySelector('button');
  const toast = document.querySelector('.toast');
  const closeIcon = document.querySelector('.close');
  const progress = document.querySelector('.progress');

  let toastTimer = setTimeout(() => {
    toast.classList.remove('active');
    progress.classList.remove('active');
  }, 3000);

  closeIcon.addEventListener('click', () => {
    toast.classList.remove('active');
    progress.classList.remove('active');
    clearTimeout(toastTimer);
  });
}
