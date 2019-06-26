var Jimp = require("jimp");
var fs = require('fs')
var QrCode = require('qrcode-reader');
var OTPAuth = require('otpauth');
var totp = require('totp');
const queryString = require('query-string');

const read = (url) => {
  return new Promise(async (resolve, reject) => {
    var buffer = fs.readFileSync(__dirname + '/download.png');
    const imageData = await Jimp.read(buffer)
    var qr = new QrCode();
    qr.callback = await
    function (err, value) {
    
      if (err) return reject(err)

      const {
        algorithm,
        digits,
        issuer,
        period,
        secret,
      } = queryString.parseUrl(value.result).query

      let totp = new OTPAuth.TOTP({
        issuer,
        algorithm,
        digits: Number(digits),
        period: Number(period),
        secret: OTPAuth.Secret.fromB32(secret)
      });

      let token = totp.generate();

      let delta = totp.validate({
        token: token,
        window: 10
      });
      return resolve(token)
    };
    qr.decode(imageData.bitmap);
  })
}

const execute = async () => {
  const result = await read()
  console.log(result);
  
}

console.log(execute());



// module.exports = read;