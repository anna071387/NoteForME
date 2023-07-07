// Import Express.js
const express = require("express");

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");
const fs = require("fs");

const id = require("./helpers/id");
// Specify on which port the Express.js server will run
const port = process.env.PORT || 3001
// Initialize an instance of Express.js
const app = express();

// Static middleware pointing to the public folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create Express.js routes for default '/', '/notes' endpoints
app.get("/", (req, res) => res.send("Navigate to / default"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    res.json(JSON.parse(data));
  });
});

// listen() method is responsible for listening for incoming connections on the specified port
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      ...req.body,
    };
    console.log("new note");

    let data = fs.readFileSync("./db/db.json", "utf-8");

    const dataJSON = JSON.parse(data);
    dataJSON.push(newNote);

    app.get("/api/notes/:note_id", (req, res) => {
      if (req.params.note_id) {
        console.info(`${req.method} request received to get a single note`);
        const noteId = req.params.note_id;
        for (let i = 0; i < noteList.length; i++) {
          const currentNote = notes[i];
          if (currentNote.review_id === noteId) {
            res.status(200).json(currentNote);
            return;
          }
        }
        res.status(404).send("Note not found");
      } else {
        res.status(400).send("Note ID does not exist");
      }
    });

    // Write the string to a file
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(data);

        // Add a new review
        parsedNote.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
