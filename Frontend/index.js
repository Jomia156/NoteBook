import Express from "express"
import config from "./config.js"

const app = Express()

app.use("/", Express.static("./www"))
app.get("/", (req, res) => { res.sendFile("./www/index.html") })
app.listen(config.port, () => {
    console.log(`Server started from ${config.host}:${config.port}`)
})