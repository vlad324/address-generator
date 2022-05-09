import crypto from 'crypto';
import secp256k1 from 'secp256k1';
import keccak256 from 'keccak256';
import ethers from "ethers";

const toAddress = (privateKey) => {
  const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
  return keccak256(Buffer.from(publicKey)).slice(-20).toString('hex');
}

const generateAddress = (regex1, regex2) => {
  let privateKey;
  let address;

  let counter = 0;
  while (true) {
    privateKey = crypto.randomBytes(32);
    address = toAddress(privateKey);

    counter++;
    if (counter % 100_000 === 0) {
      console.log("Date:", new Date(), "Counter:", counter);
    }

    if (address.match(regex1)) {
      console.log('Found match', address);
      const addressWithChecksum = ethers.utils.getAddress(address);
      if (addressWithChecksum.match(regex2)) {
        console.log("Address:", addressWithChecksum);
        console.log("Private key:", privateKey.toString('hex'));
        return;
      }
    }
  }
}

const generalPattern = /c0ffee/i;
const checksumPattern = /^0x.*C0FFEE.*$/;
generateAddress(generalPattern, checksumPattern);