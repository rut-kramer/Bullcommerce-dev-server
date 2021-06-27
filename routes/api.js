
// const {Router} = require('express');
// const express=require('express');

const router = require('express').Router();

const firebaseController = require('../controllers/firebase');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const categoryController = require('../controllers/category');
const featuredProductsController = require('../controllers/featuredProducts');
const storeController = require('../controllers/store');
const orderController = require('../controllers/order');
const attributeController = require('../controllers/attribute');
const termController = require('../controllers/term');
const paperController = require('../controllers/paper');
const categoryDesignController = require('../controllers/categoryDesign');
const newsletterDesignController = require('../controllers/newsletterDesign');

router.post('/getAccessToken', firebaseController.getToken);
router.post('/checkPremission/:username', firebaseController.checkPremission);
//check permission of new login:
router.post('/checkPremission/:username', userController.checkPermission);
router.post('/usernameCheck', firebaseController.usernameCheck);

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products/newProduct', productController.newProduct);
router.post('/products/editProduct/:id', productController.editProduct);
router.post('/products/deleteProduct/:id', productController.deleteProduct);
router.get('/productsByCategory/:categoryId', productController.getProductsByCategory);

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories/newCategoty', categoryController.newCategory);

router.post('/categories/editCategoty/:id', categoryController.editCategory);
router.post('/categories/deleteCategoty/:id', categoryController.deleteCategory);

router.get('/featuredProducts', featuredProductsController.getAllfeaturedProducts);
router.get('/featuredProducts/:id', featuredProductsController.getfeaturedProductsById);
router.post('/featuredProducts/newfeaturedProducts', featuredProductsController.newfeaturedProducts);
router.post('/featuredProducts/editfeaturedProducts/:id', featuredProductsController.editfeaturedProducts);
router.post('/featuredProducts/deletefeaturedProducts/:id', featuredProductsController.deletefeaturedProducts);

router.get('/stores', storeController.getAllStores);

router.get('/stores/:name', storeController.getStoreByStoreName);
router.get('/stores/:id', storeController.getStoreById);
router.post('/stores/newStore', storeController.newStore);
router.post('/stores/editStore/:id', storeController.editStore);
router.post('/stores/deleteStore/:id', storeController.deleteStore);
router.get('/stores/storeCategories/:storeId', storeController.categoriesByStore);
router.get('/stores/storeOrders/:storeId', storeController.ordersByStore);
router.get('/stores/storeAttributes/:storeId', storeController.attributesByStore);

router.get('/orders/:storeId', orderController.getAllOrdersOfStore);
router.get('/orders/:trackingId', orderController.getOrderByTrackingId);
router.post('/orders/newOrder', orderController.newOrder);
router.post('/orders/deleteOrder/:trackingId', orderController.deleteOrder);
router.post('/orders/changeOrderStatus/:trackingId', orderController.changeOrderStatus);
router.post('/orders/updateOrder/:trackingId', orderController.updateOrder);

router.get('/attributes', attributeController.getAllAttributes);
router.get('/attributes/:id', attributeController.getAttributeById);
router.post('/attributes/newAttribute', attributeController.newAttribute);
router.post('/attributes/deleteAttribute/:id', attributeController.deleteAttribute);
router.get('/attributesByStore/:storeId', attributeController.getAttributesByStore);
router.post('/attributes/editAttribute/:id', attributeController.editAttribute);

router.get('/terms', termController.getAllTerms);
router.post('/terms/newTerm', termController.newTerm);
router.post('/terms/delete/:id', termController.deleteTerm);


router.post('/papers/newPaper', paperController.newPaper);
router.get('/papers/getAllPapersOfStore/:storeId', paperController.getAllPapersOfStore);
router.post('/papers/deletePaper/:id', paperController.deletePaper);
router.post('/papers/editPaper/:id', paperController.editPaper);


router.get('/users', userController.getAllUsers);
router.get('/users/:email', userController.getUserByEmail);
router.get('/userByUid/:uid', userController.getUserByUid)
router.get('/users/getAllStores/:userId', userController.getStoresOfUser);
router.get('/users/latestStoreOfUser/:userId', userController.latestStoreOfUser);
//השורה הזאת עושה בעיות אין לי מושג למה
// router.post('/users/editUser/:userId', userController.editUesr);

const uploadImageController = require('../controllers/uploadImage');
router.post('/uploadImage/:uid', uploadImageController.uploadImage);

const bullcommerceHeaderDesignController = require('../controllers/bullcommerceHeader');
router.post('/designs/newBullcommerceHeader/', bullcommerceHeaderDesignController.newBullcommerceHeaderDesign);
router.post('/designs/editBullcommerceHeader/:id', bullcommerceHeaderDesignController.editBullcommerceHeaderDesign);
router.get('/designs/getBHDByStoreId/:storeId', bullcommerceHeaderDesignController.getBHDById);

// router.get('/users', userController.getAllUsers);
// router.post('/users/add', userController.addUser);
// router.get('/users/:id', userController.updateUser)

router.post('/designs/newCategoryDesign/', categoryDesignController.newCategoryDesign);
router.post('/designs/editCategoryDesign/:id', categoryDesignController.editCategoryDesign);

const storeNavbarDesignController = require('../controllers/storeNavbarDesign');

router.post('/designs/newStoreNavbarDesign/', storeNavbarDesignController.newStoreNavbarDesign);
router.post('/designs/editStoreNavbarDesign/:id', storeNavbarDesignController.editStoreNavbarDesign);
router.get('/designs/getStoreNavbarDesignById/:storeId', storeNavbarDesignController.getStoreNavbarDesignById);

router.post('/designs/newStoreNewsletterDesign/', newsletterDesignController.newNewsletterDesign);
router.post('/designs/editStoreNewsletterDesign/:id', newsletterDesignController.editNewsletterDesign);
router.get('/designs/getStoreNewsletterDesign/:storeId', newsletterDesignController.getNewsletterDesignById)

module.exports = router;