const normalizeKenyaPhone = (phone) => {
  if (!phone) return phone;

  phone = phone.toString().trim();

  // Remove spaces
  phone = phone.replace(/\s+/g, "");

 
  if (phone.startsWith("0")) {
    phone = "+254" + phone.substring(1);
  }

 
  else if (phone.startsWith("254")) {
    phone = "+" + phone;
  }

  return phone;
};
export default normalizeKenyaPhone