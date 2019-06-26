var Jimp = require("jimp");
var fs = require('fs')
var QrCode = require('qrcode-reader');
var OTPAuth = require('otpauth');
var totp = require('totp');
const { generateLabel } = require('./helper');
const queryString = require('query-string');

const read = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newUrl = url.replace(/^data:image\/\w+;base64,/, "");
      let buffer = Buffer.from(newUrl, 'base64');
      // let buffer = fs.readFileSync(__dirname + '/download.png')
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
          label: generateLabel(value.result),
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
    } catch (error) {
      return reject(error)
    }
  })
}

// read()

module.exports = read;