import {CryptoJS} from './aes'
const encrypt = (key, text) => {
  const aes_key = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(key);

  let data = CryptoJS.AES.encrypt(text, aes_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return data.toString()
}

//解密
const decrypt = (key, text) => {
  const aes_key = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(key);

  let data = CryptoJS.AES.decrypt(text, aes_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Utf8.stringify(data);
}
export{
  encrypt,
  decrypt
}