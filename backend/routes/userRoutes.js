import router from "express";
import { login, signup, verifyotp } from "../controllers/userController.js"

const userRouter = router()

userRouter.post("/login", login)
userRouter.post("/signup", signup)
userRouter.post("/verify", verifyotp)
export default userRouter