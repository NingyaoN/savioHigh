const options = {
  url: "http://enterprise.smsgupshup.com/GatewayAPI/rest",
  qs: {
    method: "SendMessage",
    msg_type: "TEXT",
    userid: "2000148140",
    auth_scheme: "plain",
    password: "hvDjCw",
    v: "1.1",
    format: "text"
  }
};

const getSms = (type, otp) => {
  switch (type) {
    case "otp":
      return `Your tklmovie verification code is ${otp}. Happy ordering :)`;
    case "rotp":
      return `Your tklmovie verification code is ${otp}. Happy ordering :)`;
    default:
      break;
  }
};

module.exports = { getSms, options };
