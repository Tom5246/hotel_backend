const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  secure: true
});

module.exports = {
  client,
  uploadFile: async function(file, folder = 'uploads') {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname}`;
      const result = await client.put(fileName, file.buffer);
      
      return {
        url: result.url,
        name: fileName,
        size: file.size
      };
    } catch (error) {
      console.error('OSS上传失败:', error);
      throw new Error('文件上传失败');
    }
  },
  
  deleteFile: async function(fileName) {
    try {
      await client.delete(fileName);
      return true;
    } catch (error) {
      console.error('OSS删除失败:', error);
      throw new Error('文件删除失败');
    }
  }
};