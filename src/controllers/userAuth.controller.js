import { password } from "bun";
import { User } from "../models/User.model"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.utils";


const generateToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken();

        user.refreshToken = RefreshToken;
        await user.save({validateBeforeSave:false});

        return { AccessToken, RefreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access token "
        );
    }
};

const createUser = asyncHandler(async (req,res) => {
    const { name,email,password,role} = req.body;

    if(!name || !email || !password ){
        throw new ApiError(
            400,
            "Name, email and password are required",
            []
    )};

    const existedUser = await User.findOne({ email: email.toLowerCase()});

    if(existedUser){
        throw new ApiError(
            409,
            "User with email already exists",
            []
        )};
    
    const allowedRoles = ["viewer", "analyst", "admin"];
    
    if(role && !allowedRoles.includes(role)){
        throw new ApiError(
            400,
            "invalid role",
            []
        )};

    const user = await User.create({
        name,
         email: email.toLowerCase(),
        password,
        role : role, 
        status : "inactive",
        isEmailVerified : false
    });    

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false});

    await sendEmail({
        email : user?.email,
        subject: "Please verify your email",
        mailgenContent : emailVerificationMailgenContent(
            user.name,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if(!createdUser){
        throw new ApiError(
            500,
            "Something went wrong while registering a user"
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            { user: createdUser },
            "User registeres successfully"
        ),
      );
});

const loginUser = asyncHandler(async(req,res) => {
    const { email , password } = req.body;

    if(!email){
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const user = await User.findOne({ email: email.toLowerCase()});

    if(!user){
        throw new ApiError(
            400,
            "User does not exist"
        );
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(
            400,
            "Password is incorrect"
        );
    }

    const { AccessToken, RefreshToken} = await generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "name email "
    );

    const options = {
        httpOnly : true,
        secure : false
    }

    return res 
     .status(200)
     .cookie("accessToken", AccessToken, options)
     .cookie("refeshToken", RefreshToken, options)
     .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,
                accessToken : AccessToken,
            },
            "User LoggedIn Successfully"
        )
     )
});

const logoutUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(
            400,
            "User does not exists"
        );
    }
    user.refreshToken = "";
    user.save({validateBeforeSave : false});

    const options = {
        httpOnly : true,
        secure : false
    }

    return res 
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(
        new ApiResponse(
            200,
            {},
            "User loggedOut Successfully"
        )
     )
});

const updateUserDetails = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(
            400,
            "user does not exist"
        );
    }

    const { email, name, oldPassword, newPassword} = req.body;
     if(name){
        user.name = name;
        
     }

     if(email && email !== user.email){

        const isEmailExist = await User.findOne({email : email.toLowerCase()});

        if(isEmailExist){
            throw new ApiError(
                400,
                "Email already exist"
            );
        }

        user.email = email;
        user.isEmailVerified = false;

        const {hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = tokenExpiry;

        await sendEmail({
            email: user?.email,
            subject : "Please verify your email",
            mailgenContent : emailVerificationMailgenContent(
            user.name,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
        });
     }


     if(oldPassword || newPassword){

             if(oldPassword || !newPassword){
        throw new ApiError(
            400,
            "Both the old and new Password are required"
        );
     }
        const isMatch = await user.isPasswordCorrect(oldPassword);

        if(!isMatch){
            throw new ApiError(
                400,
                "old Password is incorrect"
            );
        }

        user.password = newPassword;
     }
      await user.save({validateBeforeSave : false});
     const UpdatedUserDetail = await User.findById(user._id).select( "name email");

     return res 
      .status(200)
      .json(
        new ApiResponse(
            200,
            UpdatedUserDetail,
            "Update user credintials successfully"
        )
      );
});

export {
    createUser,
    loginUser,
    logoutUser,
    updateUserDetails
}