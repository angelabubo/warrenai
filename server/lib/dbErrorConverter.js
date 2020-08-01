const dbErrorConverter = (error) => {
  switch (error.errno) {
    case 1062: //ER_DEP_ENTRY
      error.message = "Duplicate entry.";
      break;
    default:
      break;
  }

  return error;
};

module.exports = dbErrorConverter;
