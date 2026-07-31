const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// KEY YANG DIIZINKAN
// ==============================
const VALID_KEYS = [
    "VCX-109",
    "PREMIUM-2026"
];

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json());

app.use(session({
    secret: "vcx_proxy_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 hari
    }
}));

app.use(express.static(__dirname));

// ==============================
// LOGIN PAGE
// ==============================
app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect("/dom.html");
    }

    res.sendFile(path.join(__dirname, "login.html"));
});

// ==============================
// LOGIN API
// ==============================
app.post("/api/login", (req, res) => {

    const key = (req.body.key || "").trim();

    if (!key) {
        return res.status(400).json({
            success: false,
            message: "Key kosong."
        });
    }

    if (!VALID_KEYS.includes(key)) {
        return res.status(401).json({
            success: false,
            message: "Invalid Access Key"
        });
    }

    req.session.loggedIn = true;

    res.json({
        success: true,
        redirect: "/dom.html"
    });

});

// ==============================
// LOGOUT
// ==============================
app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

});

// ==============================
// PROTECT DASHBOARD
// ==============================
app.get("/dom.html", (req, res) => {

    if (!req.session.loggedIn) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "dom.html"));

});

// ==============================
// 404
// ==============================
app.use((req, res) => {

    res.status(404).send("404 Not Found");

});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {

    console.log("=================================");
    console.log(" VCX Proxy Server");
    console.log(" Running on Port :", PORT);
    console.log("=================================");

});