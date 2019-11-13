const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const reversionScript = require("./reversion.js");

const port = 8080;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/status', async (req, res) => {
    res.status(200).json({
        message: "OK"
    });
})

app.post("/reversion", async (req, res) => {
    const script = req.body;
    try {
        const response = await reversionScript.reversionScript(script);
        res.status(200).json({
            response,
        })
    }
    catch(e) {
        throw e;
    }
});

app.listen(port, () => {
    console.log(`running at port ${port}`);
});

module.exports = {
    app
}