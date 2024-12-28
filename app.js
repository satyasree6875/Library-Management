const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize=require('./util/database')
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    }).catch(err=>console.log(err)
    )
})//this middleware function acts as an authentication HOW ?
//  if the user is user is only available in the database then only we can access the services of an app but HOW?
// if the user is available then only we can access the adminRoutes and shopRoutes..
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


// Each Product belongs to a User, implying that each product is owned by one user.
// onDelete: 'CASCADE': If a user is deleted, the products associated with that user will also be deleted.
Product.belongsTo(User,{constrains:true,onDelete:'CASCADE'});
User.hasMany(Product)

User.hasOne(Cart);
Cart.belongsTo(User);//actually this is optional bcz User.hasOne(Cart); and Cart.belongsTo(User); are inversely same 

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem})

// this sync basically creates table for a model and also defines the relationships between the model
// The force: true option tells Sequelize to drop the existing tables (if they exist) and recreate them. -
// - This is useful during development when you want to reset the database structure based on your current models, but be cautious as it will drop all data in those tables.
// sequelize.sync({force:true}).then(result=>{
//     // console.log(result)
//     }).catch(err=>console.log(err));
sequelize.sync({}).then(result=>{
    return User.findByPk(1)
    // console.log(result)
    })
    .then(user=>{
        if(!user){
            return User.create({name : 'karthik', email:'karthik@sasi.ac.in'});
        }
        return user
    })
    .then(user=>{
        console.log(user);
        return user.createCart();
    })
    .then(user=>console.log('user')
    )
    .catch(err=>console.log(err));


app.listen(3000);
