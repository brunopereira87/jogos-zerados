const express = require("express");
const router = express.Router();
const imageMiddleware = require("../middlewares/imageMiddleware");
const PlataformsController = require("../controllers/PlataformsController");

router
  .route("/")

  .get(PlataformsController.getAllPlataforms);

router
  .route("/admin")
  .post(
    imageMiddleware.upload.single("logo"),
    PlataformsController.createPlataform
  );
router.route("/:slug").get(PlataformsController.getPlataform);

router
  .route("/admin/:id")
  .get(PlataformsController.getPlataformById)
  .patch(
    imageMiddleware.upload.single("logo"),
    PlataformsController.updatePlataform
  )
  // .put(
  //   imageMiddleware.upload.single("logo"),
  //   PlataformsController.updatePlataform
  // )
  .delete(PlataformsController.deletePlataform);
module.exports = router;
