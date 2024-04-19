const express = require("express");
const path = require("path");
const multer = require("multer");

// File Upload Folder

const UPLOADS_FOLDER = "./uploads/";

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

// Prepare the final multar upload object

var upload = multer({
  storage: storage,
  //   dest: UPLOADS_FOLDER,
  limits: 1000000,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf format allowed!"));
      }
    } else {
      cb(new Error("There was an unknown error!"));
    }
  },
});

const app = express();

// application rout
// app.post("/", upload.single("avatar"), (req, res) => {
//   res.send("File Has Uploaded Successfully!");
// });
app.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 2 },
  ]),
  (req, res) => {
    res.send("File Has Uploaded Successfully!");
  }
);

// app.post(
//     "/",
//     upload.fields([
//       {
//         name: "avatar",
//         maxCount: 2,
//       },
//       {
//         name: "doc",
//         maxCount: 1,
//       },
//     ]),
//     (req, res, next) => {
//       res.send("success");
//     }
//   );

// default error handler
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was an upload error!");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

app.listen(3000, () => {
  console.log("app listening at port 3000");
});
