import * as express from "express";
import remocon from "./remocon_signal";
import skill from "./alexa_skill";

const app = express();
app.use("/remocon", remocon);
app.use("/skill", skill);

export default app;
