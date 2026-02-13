import mongoose from "mongoose";

const uri =
  "mongodb://hammadkhan:Hammad321@cluster01-shard-00-00.cjilcc9.mongodb.net/jobPortal?retryWrites=true&w=majority";

console.log("URI BEING USED:", uri);

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("ERROR:", err);
    process.exit();
  });
