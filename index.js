import express from "express";
import fs from "fs";
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readdir("./files", function (err, files) {
    res.render("index", { filename: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    res.render("show", {
      filename: req.params.filename,
      filedata: data,
    });
  });
});

app.post("/create", (req, res) => {
  const sanitizedTitle = req.body.title.split(" ").join("").trim();
  fs.writeFile(
    `./files/${sanitizedTitle}.txt`,
    req.body.content,
    function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    }
  );
});

app.post("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.post("/edit/:filename", (req, res) => {
  const oldFilename = `./files/${req.params.filename}`;
  const newFilename = `./files/${req.body.newTitle
    .split(" ")
    .join("")
    .trim()}.txt`;

  fs.rename(oldFilename, newFilename, function (err) {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(newFilename, req.body.newContent, function (err) {
        if (err) {
          console.log(err);
        }
        res.redirect(
          `/file/${req.body.newTitle.split(" ").join("").trim()}.txt`
        );
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server up and running at port 3000");
});
