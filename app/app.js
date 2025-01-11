const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const auctionsRoutes = require("./routes/auctions.routes");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");

const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auctions", auctionsRoutes);
app.use("/api", usersRoutes);
app.use("/api/auth", authRoutes);
app.use('/images', express.static("./pubic/images"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
