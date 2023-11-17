let qr = require("node-qr-image");
const imagekit = require("../lib/imagekit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ResponseTemplate } = require("../helper/template_helper");
module.exports = {
  storageImage: async (req, res) => {
    const { name, description, url, title, user_id } = req.body;
    const user = req.user;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    const createdImage = await prisma.image.create({
      data: {
        name: req.file.filename,
        title: title,
        url: imageUrl,
        description: description,
        user_id: user.id,
      },
      include: {
        user: true,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        image_url: imageUrl,
      },
    });
  },
  storageVideo: (req, res) => {
    const videoUrl = `${req.protocol}://${req.get("host")}/videos/${
      req.file.filename
    }`;
    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        video_url: videoUrl,
      },
    });
  },
  storageFile: (req, res) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/files/${
      req.file.filename
    }`;
    return res.status(200).json({
      status: true,
      message: "Success",
      data: {
        file_url: fileUrl,
      },
    });
  },

  generateQR: (req, res) => {
    const message = req.query.message;
    var qr_png = qr.image(message, { type: "png" });
    qr_png.pipe(
      require("fs").createWriteStream(
        `./public/qr/${message.toLowerCase()}.png`
      )
    );
    // const qr_png = qr.image(message, { type: "png" });
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: qr_png,
    });
  },

  imagekitUpload: async (req, res) => {
    const { name, description, url, title, user_id } = req.body;
    const user = req.user;
    try {
      const stringFile = req.file.buffer.toString("base64");
      if (!user) {
        res.redirect("/auth/login");
      }
      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });
      const createdImage = await prisma.image.create({
        data: {
          name: uploadFile.name,
          title: title,
          url: uploadFile.url,
          description: description,
          user_id: user.id,
        },
        include: {
          user: true,
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
  },

  gallery: async (req, res) => {
    const images = await prisma.image.findMany({
      select: {
        id: false,
        name: true,
        title: true,
        url: true,
        description: true,
        user_id: false,
      },
      // include: {
      //   user: true,
      //   // categories: true,
      // },
    });
    let resp = ResponseTemplate(images, "success", null, 200);
    res.json(resp);
  },

  updateImage: async (req, res) => {
    const { id } = req.params;
    const { description, title } = req.body;
    const payload = {
      // user_id: parseInt(user_id),
      // name: name,
      description: description,
      title: title,
    };
    // if (!payload.name || !payload.description || !payload.title) {
    //   let resp = ResponseTemplate(null, "bad request", null, 400);
    //   res.json(resp);
    //   return;
    // }
    try {
      const images = await prisma.image.update({
        where: {
          id: Number(id),
        },
        data: payload,
        select: {
          user_id: false,
          name: true,
          title: true,
          url: true,
          description: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
        },
      });

      let resp = ResponseTemplate(images, "success", null, 200);
      res.json(resp);
      return;
    } catch (error) {
      let resp = ResponseTemplate(null, "internal server error", error, 500);
      res.json(resp);
      return;
    }
  },

  deleteImage: async (req,res) => {
    const { id } = req.params;
    try {
      await prisma.image.delete({
        where: {
          id: Number(id),
        },
      });
      let resp = ResponseTemplate(null, "delete success", null, 200);
      res.json(resp);
      return;
    } catch (error) {
      let resp = ResponseTemplate(null, "internal server error", error, 500);
      res.json(resp);
      return;
    }
  }

  // generateRandomString: (length) => {
  //   var result = "";
  //   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   var charactersLength = characters.length;
  //   for (var i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // },
};
