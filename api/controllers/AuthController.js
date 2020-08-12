const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
    tokenExpiration: cookieOptions.expires
  });
};
exports.signUp = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Por favor, digite o email e a senha!", 400));
  }

  const user = await User.findOne({ email, active: true }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Email e/ou senha incorretos", 401));
  }

  createSendToken(user, 200, res);
});

exports.protected = catchAsync(async (req, res, next) => {
  //1) Checar se existe token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "Você precisa estar logado para ter acesso a esta área.",
        401
      )
    );
  }

  //2) Decodificar o token para pegar o id do usuário
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Checar se o usuário ainda existe através do id extraído do token
  const freshUser = await User.findById(decode.id);

  if (!freshUser) {
    return next(
      new AppError("O usuário relacionado a esse token está desativado", 401)
    );
  }

  if (freshUser.active === false) {
    return next(
      new AppError("O usuário relacionado a esse token não existe mais", 401)
    );
  }
  //4 Checar se a senha foi alterada após o token ser pego
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        "Senha alterada recentemente! Realize o login novamente!",
        404
      )
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Você não tem permissão para executar esta ação", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Obter o usuário através do email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("Email não encontrado!", 404));
  }

  //2) Gerar o token randomico e salvar no banco de dados
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Enviar o email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;
  const message = `Esqueceu sua senha? Envie uma requisição patch com os campos password e passwordConfirm 
  para ${resetURL}.\nSe você não esqueceu sua senha, por favor, ignore este email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Seu token de redefinição de senha(válido por 10 minutos)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token enviado ao email"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "Ocorreu um erro ao enviar o email. Tente novamente mais tarde",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Obter o usuário com base no token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //2) Se o token não tiver expirado, e existir o usuário, atribuir a senha nova
  if (!user) {
    return next(new AppError("Token inválido ou expirado", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //1) Pegar os dados do usuario logado

  const user = await User.findById(req.user.id).select("+password");

  //2) Checar se a senha digitada está correta
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Senha incorreta!", 401));
  }
  //3) Atualizar, caso esteja correto
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  const updateUser = await user.save();
  createSendToken(user, 200, res);
});
