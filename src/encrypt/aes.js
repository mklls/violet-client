import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

const encrypt = (plaintext, iv, secretKey) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);

  return encrypted.toString('hex');
};

const decrypt = (ciphertext, iv, secretKey) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

export default {
  encrypt,
  decrypt
};
