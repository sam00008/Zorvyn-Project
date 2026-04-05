import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";

const verifyjwt = asyncHandler(async(req,res,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    try {
            if(!token) {
        throw new ApiError(
            401,
            "Unauthorized Request"
        );
    }

    const decodeToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry" 
    );

    if(!user){
        throw new ApiError(
         401,
         "Invalid access token" 
        )
    }

    req.user = user;
    next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token");
    }

});

export { verifyjwt };