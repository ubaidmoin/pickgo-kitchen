export const validateEmail = (email) => {
  const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const formatCurrency = (value, divide = false) => {
  if (divide) {
    return `₭ ${parseFloat(value / 100)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  } else {
    return `₭ ${parseFloat(value)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }
};
