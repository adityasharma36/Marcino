const ImageKit = require('@imagekit/nodejs');
const { toFile } = require('@imagekit/nodejs');

const client = new ImageKit({

  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'test_public_key',

  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'test_private_key',

  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/example'
  
});

async function upload({ file, fileName, folder }) {
  const fileInput = Buffer.isBuffer(file) ? await toFile(file, fileName) : file;

  return client.files.upload({
    file: fileInput,
    fileName,
    folder
  });
}

module.exports = {
  upload
};
