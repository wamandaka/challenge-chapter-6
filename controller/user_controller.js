const imagekit = require("../lib/imagekit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ResponseTemplate } = require("../helper/template_helper");
const { json } = require("express");

async function imagekitUpload(req, res) {
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
}

async function gallery(req, res) {
  const images = await prisma.image.findMany({
    where: {
      user_id: req.user.id,
      deleted_at: null,
    },
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
  const responseData = {
    images,
    user: req.user,
  };

  // Check if the request accepts text/html or has a .ejs extension
  const acceptHeader = req.headers.accept || "";
  const isEjsRequest =
    acceptHeader.includes("text/html") || req.url.endsWith(".ejs");

  // If it's a text/html request, send Ejs response
  if (!isEjsRequest) {
    let resp = ResponseTemplate(images, "success", null, 200);
    return res.json(resp);
  }
  // Jika permintaan HTML/EJS, render tampilan EJS
  res.render("gallery.ejs", responseData);
}

async function updateImage(req, res) {
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
}

async function deleteImage(req, res) {
  const { id } = req.params;
  const payload = {
    deleted_at: new Date(),
  };
  try {
    await prisma.image.update({
      where: {
        id: Number(id),
      },
      data: payload,
    });
    let resp = ResponseTemplate(null, "soft delete success", null, 200);
    res.json(resp);
    return;
  } catch (error) {
    let resp = ResponseTemplate(null, "internal server error", error, 500);
    res.json(resp);
    return;
  }
}

async function whoami(req, res) {
  return res.status(200).json({
    status: 200,
    message: "success",
    data: req.user,
  });
}

module.exports = {
  imagekitUpload,
  gallery,
  updateImage,
  deleteImage,
  whoami,
  // imagekitUpload: async (req, res) => {
  //   const { name, description, url, title, user_id } = req.body;
  //   const user = req.user;
  //   try {
  //     const stringFile = req.file.buffer.toString("base64");
  //     if (!user) {
  //       res.redirect("/auth/login");
  //     }
  //     const uploadFile = await imagekit.upload({
  //       fileName: req.file.originalname,
  //       file: stringFile,
  //     });
  //     const createdImage = await prisma.image.create({
  //       data: {
  //         name: uploadFile.name,
  //         title: title,
  //         url: uploadFile.url,
  //         description: description,
  //         user_id: user.id,
  //       },
  //       include: {
  //         user: true,
  //       },
  //     });
  //     return res.json({
  //       status: 200,
  //       message: "success",
  //       data: {
  //         name: uploadFile.name,
  //         url: uploadFile.url,
  //         type: uploadFile.fileType,
  //       },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // gallery: async (req, res) => {
  //   const images = await prisma.image.findMany({
  //     select: {
  //       id: false,
  //       name: true,
  //       title: true,
  //       url: true,
  //       description: true,
  //       user_id: false,
  //     },
  //     // include: {
  //     //   user: true,
  //     //   // categories: true,
  //     // },
  //   });
  //   let resp = ResponseTemplate(images, "success", null, 200);
  //   res.json(resp);
  // },

  // updateImage: async (req, res) => {
  //   const { id } = req.params;
  //   const { description, title } = req.body;
  //   const payload = {
  //     // user_id: parseInt(user_id),
  //     // name: name,
  //     description: description,
  //     title: title,
  //   };
  //   // if (!payload.name || !payload.description || !payload.title) {
  //   //   let resp = ResponseTemplate(null, "bad request", null, 400);
  //   //   res.json(resp);
  //   //   return;
  //   // }
  //   try {
  //     const images = await prisma.image.update({
  //       where: {
  //         id: Number(id),
  //       },
  //       data: payload,
  //       select: {
  //         user_id: false,
  //         name: true,
  //         title: true,
  //         url: true,
  //         description: true,
  //         created_at: true,
  //         updated_at: true,
  //         deleted_at: true,
  //       },
  //     });

  //     let resp = ResponseTemplate(images, "success", null, 200);
  //     res.json(resp);
  //     return;
  //   } catch (error) {
  //     let resp = ResponseTemplate(null, "internal server error", error, 500);
  //     res.json(resp);
  //     return;
  //   }
  // },

  // deleteImage: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     await prisma.image.delete({
  //       where: {
  //         id: Number(id),
  //       },
  //     });
  //     let resp = ResponseTemplate(null, "delete success", null, 200);
  //     res.json(resp);
  //     return;
  //   } catch (error) {
  //     let resp = ResponseTemplate(null, "internal server error", error, 500);
  //     res.json(resp);
  //     return;
  //   }
  // },
};
