const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../lib/imagekit");

async function uploadImage(req,res) {
  const {name, description, url, type, user_id} = req.body
  try {
    const stringFile = req.file.buffer.toString("base64");
    const uploadFile = await imagekit.upload({
      fileName: req.file.originalname,
      file: stringFile,
    });
    const createdImage = await prisma.image.create({
      data: {
        name: uploadFile.fileName,
        url: uploadFile.url,
        type: type,
        description: description,
        user: {
          connect: { id: user_id },
        },
      },
    });
    return res.json({
      status: 200,
      message: "success",
      data: {
        name: uploadFile.name,
        url: uploadFile.url,
        type: uploadFile.fileType,
      },
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {

}