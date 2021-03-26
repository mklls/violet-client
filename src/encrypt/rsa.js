import NodeRSA from 'node-rsa';

let publicKey;

const init = key => (publicKey = new NodeRSA(key));
const verify = (data, signature) => publicKey.verify(data, signature);
const encrypt = (data) => publicKey.encrypt(data, 'base64');

export default { verify, encrypt, init };
