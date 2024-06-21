function getCookieSec() {
  if (process.env.NODE_ENV === "development") {
    return false;
  } else {
    return true;
  }
}

let cookieSecurity = getCookieSec();

module.exports = cookieSecurity;
