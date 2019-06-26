module.exports = {
  generateLabel(url) {
    var str = ''
    var commaCounter = 0
    for (let i = 0; i < url.length; i++) {
      if (url[i] === ':') {
        commaCounter++
      }
      if (commaCounter === 2) {
        if (url[i] === '?') {
          str = str.replace('%40', decodeURIComponent('%40'))
          return str.substring(0,str.length -1)
        } else {
          str += url[i+1]
        }
      }
    }
  },
};
