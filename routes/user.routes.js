import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
import {verifyJwt} from "../middlewares/verifyJWT.miidleware.js"

const router = Router();

router.route("/register").post(upload.fields(
    [{
        name: "avatar",
        maxCount: 1,
    }]
),registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/refresh-accessToken").post(refreshAccessToken)

export default router; 