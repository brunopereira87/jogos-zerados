const Plataform = require("../models/Plataform");
const slugify = require("slugify");
const { convertDate } = require("../helpers");
exports.createPlataform = (req, res) => {
  const slug = slugify(req.body.name, { lower: true });

  Plataform.findOne({ slug: slug })
    .exec()
    .then(doc => {
      if (doc) {
        return res.status(409).json({
          success: false,
          message: "A plataforma já existe"
        });
      }
    });

  req.body.slug = slug;
  req.body.release_date = req.body.release_date
    ? convertDate(req.body.release_date)
    : null;
  req.body.logo = req.file.path;

  console.log(req.body);
  const plataform = new Plataform(req.body);
  plataform
    .save()
    .then(() =>
      res.status(201).json({
        success: true,
        message: "Plataforma criada com sucesso"
      })
    )
    .catch(error => res.status(500).json({ error: error }));
};

exports.getAllPlataforms = (req, res) => {
  Plataform.find()
    .then(docs => {
      res.status(200).json({
        results: docs.length,
        plataforms: docs
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.getPlataform = (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  Plataform.findOne({ slug: slug })
    .then(doc => {
      if (doc) {
        res.status(200).json({
          success: true,
          plataform: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "Plataforma não encontrada", success: false });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.getPlataformById = (req, res) => {
  const id = req.params.id;
  Plataform.findOne({ _id: id })
    .then(doc => {
      if (doc) {
        res.status(200).json({
          success: true,
          plataform: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "Plataforma não encontrada", success: false });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.updatePlataformField = (req, res) => {
  const id = req.params.id;

  // const update_fields = {};
  // for (const field of req.body) {
  //   update_fields[field.name] = field.value;
  // }

  const update_fields = {};
  if (req.body.length) {
    for (const field of req.body) {
      // update_fields[field] = field.value;
      console.log(field);
    }
  }

  if (req.file) {
    update_fields.logo = req.file.path;
    console.log(update_fields);
  }
  //console.log(req.body.logo);
  Plataform.findOneAndUpdate({ _id: id }, update_fields)
    .then(results => {
      if (results) {
        res.status(200).json({
          message: "Plataforma atualizada com sucesso",
          success: true
        });
      } else {
        res
          .status(404)
          .json({ message: "Plataforma não encontrada", success: false });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.updatePlataform = (req, res) => {
  const id = req.params.id;
  if (req.file) {
    req.body.logo = req.file.path;
  }

  Plataform.findOneAndUpdate({ _id: id }, req.body)
    .then(() =>
      res
        .status(200)
        .json({ message: "Plataforma atualizada com sucesso", success: true })
    )
    .catch(err => res.status(500).json({ error: err }));
};

exports.deletePlataform = (req, res) => {
  const id = req.params.id;
  Plataform.deleteOne({ _id: id })
    .then(doc => {
      if (doc) {
        res.status(200).json({
          success: true,
          plataform: doc,
          message: "Plataforma removida com sucesso"
        });
      } else {
        res
          .status(404)
          .json({ message: "Plataforma não encontrada", success: false });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};
