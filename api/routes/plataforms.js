const express = require("express");
const router = express.Router();
const imageMiddleware = require("../middlewares/imageMiddleware");
const PlataformsController = require("../controllers/PlataformsController");

router
  .route("/")
  .post(
    imageMiddleware.upload.single("logo"),
    PlataformsController.createPlataform
  )
  .get(PlataformsController.getAllPlataforms);
router.route("/:slug").get(PlataformsController.getPlataform);
router
  .route("/admin/:id")
  .get(PlataformsController.getPlataformById)
  .patch(
    imageMiddleware.upload_single,
    PlataformsController.updatePlataformField
  )
  .put(imageMiddleware.upload_single, PlataformsController.updatePlataform)
  .delete(PlataformsController.deletePlataform);
module.exports = router;
