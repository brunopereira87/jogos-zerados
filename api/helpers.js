exports.convertDate = string => {
  let dataString = string.split("/");
  return new Date(dataString[2], dataString[1] - 1, dataString[0]);
};

exports.stringToArray = (string, separator) => {
  return string.split(separator).map(str => str.trim());
};
