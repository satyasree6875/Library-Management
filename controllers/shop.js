const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((product)=>{
    res.render('shop/product-list', {
      prods: product,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err=>console.log(err)
  )
    
  
};
// here we are  fetching the the product through id
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
//   Product.findAll({where : { id : prodId}})
//   .then(products=>{
//     res.render('shop/product-detail', {
//       product: products[0],
//       pageTitle: product[0].title,
//       path: '/products'
//     });

//   }).catch(err=>console.log(err));
// };
// Antother way for retriving the only required product...
  Product.findByPk(prodId).then(product=>{
    console.log(product);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });

  }).catch(err=>console.log(err));
};

// fetching all thee items
exports.getIndex = (req, res, next) => {
  // here findAll() fetch the all the products from the data base 
  Product.findAll().then(
    (product)=>{
      res.render('shop/index', {
        prods: product,
        pageTitle: 'Shop',
        path: '/'
      });
    }
  ).catch(err=>{console.log(err);
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart=>{
    return cart.getProducts().then(products=>{
      res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
      })
    })
    .catch(err=>console.log(err)
    )
  })
  .catch(err=>console.log(err))



  // another way without sequelize
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user.getCart()
  .then(cart=>{
    fetchedCart=cart;//storing the all the data from the cart to fetchedCart
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    let product,newQuantity=1;
    if(products.length>0){
      product=products[0];//if the product is currently available in the cart then we have to increase the quantity of the product.
    }
    if(product){
      const oldQuantity=product.cartItem.quantity;
      newQuantity=oldQuantity+1;
      return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
      // addProduct id a function which is used when there is an'" many to many relationship"' occurs then we can use addProduct to add a product.
      // through make changes in quantity
    }
    return Product.findByPk(prodId).then(product=>{
      return fetchedCart.addProduct(product ,{through:{quantity: newQuantity}})
    })
    .catch(err=>console.log(err))

  })
  
  .catch(err=>console.log(err))
  
  
  
  
  // without sequelize ...
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts().then(products=>{
      const product=products[0];
      return product.cartItem.destroy().then(result=>{
        res.redirect('/cart');
      })
    })
  }).catch(err=>console.log(err))
};



exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
