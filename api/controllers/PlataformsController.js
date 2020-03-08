const Plataform = require("../models/Plataform");
const slugify = require("slugify");
const { convertDate } = require("../helpers");
const APIFeature = require("../utils/APIFeature");
exports.createPlataform = async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true });
    const plataform = await Plataform.findOne({ slug: slug });

    if (plataform) {
      return res.status(409).json({
        success: false,
        message: "A plataforma já existe"
      });
    }

    req.body.slug = slug;
    req.body.release_date = req.body.release_date
      ? convertDate(req.body.release_date)
      : null;
    req.body.logo = req.file.path;

    //console.log(req.body);
    const new_plataform = await Plataform.create(req.body);
    res.status(201).json({
      success: true,
      message: "Plataforma criada com sucesso",
      plataform: new_plataform
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.getAllPlataforms = async (req, res) => {
  try {
    const feature = new APIFeature(Plataform.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const plataforms = await feature.query;

    res.status(200).json({
      results: plataforms.length,
      plataforms: plataforms
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getPlataform = async (req, res) => {
  try {
    const slug = req.params.slug;
    const plataform = await Plataform.findOne({ slug: slug });

    if (plataform) {
      res.status(200).json({
        success: true,
        plataform: plataform
      });
    } else {
      res
        .status(404)
        .json({ message: "Plataforma não encontrada", success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
exports.getPlataformById = async (req, res) => {
  try {
    const id = req.params.id;
    const plataform = await Plataform.findOne({ _id: id });

    if (plataform) {
      res.status(200).json({
        success: true,
        plataform: plataform
      });
    } else {
      res
        .status(404)
        .json({ message: "Plataforma não encontrada", success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.updatePlataform = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.file) {
      req.body.logo = req.file.path;
      console.log(req.body.logo);
    }
    //console.log(req.body.logo);
    const plataform = await Plataform.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true
    });

    if (plataform) {
      res.status(200).json({
        message: "Plataforma atualizada com sucesso",
        success: true,
        plataform
      });
    } else {
      res
        .status(404)
        .json({ message: "Plataforma não encontrada", success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// exports.updatePlataform = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (req.file) {
//       req.body.logo = req.file.path;
//     }

//     const plataform = await Plataform.findOneAndUpdate({ _id: id }, req.body, {
//       new: true,
//       runValidators: true
//     });
//     if (plataform) {
//       res.status(200).json({
//         message: "Plataforma atualizada com sucesso",
//         success: true,
//         plataform
//       });
//     } else {
//       res
//         .status(404)
//         .json({ message: "Plataforma não encontrada", success: false });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

exports.deletePlataform = async (req, res) => {
  try {
    const id = req.params.id;
    const plataform = await Plataform.deleteOne({ _id: id });
    if (plataform) {
      res.status(200).json({
        success: true,
        plataform,
        message: "Plataforma removida com sucesso"
      });
    } else {
      res
        .status(404)
        .json({ message: "Plataforma não encontrada", success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
