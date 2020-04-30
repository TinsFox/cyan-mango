var fun_aes = require('./aes.js');  //引用AES源码js
//加密加密解密
//refresh_token作为秘钥 
var key = fun_aes.CryptoJS.enc.Utf8.parse(wx.getStorageSync('refresh_token')  );  
//十六位十六进制数作为秘钥偏移量
var iv  = fun_aes.CryptoJS.enc.Utf8.parse('6666666666666666'); 
//秘钥和偏移量后台会给前端
//封装加密
const Encrypt= (word) =>{
    var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
    var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}
//封装解密
const Decrypt= (word) =>{
    var encryptedHexStr = fun_aes.CryptoJS.enc.Hex.parse(word);
    var srcs = fun_aes.CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = fun_aes.CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
export{
  Encrypt,
  Decrypt
}