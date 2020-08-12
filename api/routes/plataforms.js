const express = require('express');
const router = express.Router();
const imageMiddleware = require('../middlewares/imageMiddleware');
const PlataformsController = require('../controllers/PlataformsController');
const AuthController = require('../controllers/AuthController');

router.route('/').get(PlataformsController.getAllPlataforms);

router
  .route('/admin')
  .post(
    PlataformsController.uploadPlataformLogo,
    PlataformsController.createPlataform,
    PlataformsController.resizePlataformLogo,
    PlataformsController.updatePlataformLogo
  );
router.route('/:slug').get(PlataformsController.getPlataform);
//router.use('/admin/:id', AuthController.protected);
router
  .route('/admin/:id')
  .get(PlataformsController.getPlataformById)
  .patch(
    //AuthController.restrictTo('admin'),
    PlataformsController.uploadPlataformLogo,
    PlataformsController.updatePlataform,
    PlataformsController.resizePlataformLogo,
    PlataformsController.updatePlataformLogo
  )
  // .put(
  //   imageMiddleware.upload.single("logo"),
  //   PlataformsController.updatePlataform
  // )
  .delete(
    AuthController.restrictTo('admin'),
    PlataformsController.deletePlataform
  );
module.exports = router;
