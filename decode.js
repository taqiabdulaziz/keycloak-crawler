var Jimp = require("jimp");
var fs = require('fs')
var QrCode = require('qrcode-reader');
var OTPAuth = require('otpauth');

const read = (url) => {
  return new Promise(async (resolve, reject) => {
    var buffer = fs.readFileSync(__dirname + '/download.png');
    const imageData = await Jimp.read(buffer)
    var qr = new QrCode();
    qr.callback = await
    function (err, value) {
      if (err) {
        return reject(err)
        // TODO handle error
      }

      let totp = new OTPAuth.TOTP({
        issuer: 'boost-svc-merchant-dev',
        label: 'muhammad.taqi@myboost.id',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromB32('NJZGINKHNNUHIQKB')
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

module.exports = read;