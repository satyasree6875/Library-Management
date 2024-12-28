const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    proce: price,
    imageUrl: imageUrl,
    description: description,
  })

  
  // // Product.create() is a Sequelize method used to insert a new record into the Product table in your database.
  // Product.create({
  //   title: title,
  //   proce: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   // userId request the id from the User table where they are available
  //   userId:req.user.id
  // })


  .then((result)=>{
    console.log(result);
    res.redirect('/admin/products');
    ;
  }).catch(err=>console.log(err));
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})// it is used to retrive a particular product in the sequelize 
  // Product.findByPk(prodId)
  .then( products => {
    // it can retrive many items so we use 1st index('0')
    const product=products[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err => console.log(err));
};


//trying to print the req.user()
  // const userrr=req.user.toJSON();
  // console.log('USER INSTANCE '+userrr);
  




exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
 

  
  Product.findByPk(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save();
  }).then(result=>console.log('Updated Products')).catch(err => console.log(err));
  res.redirect('/admin/products');
};




exports.getProducts = (req, res, next) => {
  // getProducts() is a function creted by Sequelize to retrive all the products from the sql dataabase
  // In Sequelize, if you define a relationship like User.hasMany(Product), Sequelize automatically provides helper methods like .getProducts() to fetch products associated with that user.
  req.user.getProducts()
  // Product.findAll()
  .then(products => {
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
    
  }).catch(err=>console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  // to delete this producct we use product.destroy()
  .then(product=>{ return product.destroy();})
  .then(result => {console.log("product deleted")
    res.redirect('/admin/products')
  
  })
  .catch(err=>console.log(err))
};













