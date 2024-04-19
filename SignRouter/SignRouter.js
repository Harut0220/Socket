import { Router } from "express";
import SignController from "../SignController/SignController.js";





const SignRouter=Router()

SignRouter.post("/signup",SignController.signUp)
SignRouter.post("/signin", SignController.signIn);

export default SignRouter