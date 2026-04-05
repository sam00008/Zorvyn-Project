
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { ApiResponse } from "../utils/apiResponse.utils";

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const AccessToken = user.generateAccessToken();
        const RefreshToken = user.generateRefreshToken();

        user.refreshToken = RefreshToken;
        await user.save({ validateBeforeSave: false });

        return { AccessToken, RefreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating the access token "
        );
    }
};

const createAdmin = async () => {

    try {

        if (!process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new ApiError(500, "Admin credentials not set in the env file");
        }

        const AdminPresent = await User.findOne({ role: "admin" });

        if (!AdminPresent) {
            await User.create({
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL.toLowerCase(),
                password: process.env.ADMIN_PASSWORD,
                role: "admin",
                isEmailVerified: true,
                status: "active"
            });
            console.log("Admin Created successfully");
        }
        else {
            console.log("Admin Already present");
        }


    } catch (error) {
        console.error("Error creating Admin :", error.message);
    }


}

const adminLogin = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    if (!email) {
        throw new ApiError(400, "email is required");
    }

    const admin = await User.findOne({ email });

    if (!admin) {
        throw new ApiError(400, "Admin not exists");
    }

    const isPasswordvalid = await admin.isPasswordCorrect(password);
    if (!isPasswordvalid) {
        throw new ApiError(400, "Password is incorrect");
    }

    const { AccessToken, RefreshToken } = await generateToken(admin._id);

    const loggedInAdmin = await User.findById(admin._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", AccessToken, options)
        .cookie("refreshToken", RefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    Admin: loggedInAdmin,
                    accessToken: AccessToken,
                    refreshToken: RefreshToken
                },
                "admin logged in Successfully"
            )
        )
});

const updateDetails = asyncHandler(async(req,res) => {
    const admin = await User.findById(req.user._id);

    if(!admin){
        throw new ApiError(
            404,
            "Admin not found"
        );
    }

    const { name, email, oldPassword, newPassword } = req.body;

    if(name){
        admin.name = name;
    }

    if(email && email !== admin.email){
        const existingAdmin = await User.findOne({email : email.toLowerCase()});

        if(existingAdmin){
            throw new ApiError(
                400,
                "Email already exist"
            );
        }

        admin.email = email.toLowerCase();
        admin.isEmailVerified = true;
    }

    if((oldPassword && !newPassword) || (!oldPassword && newPassword)){
        throw new ApiError(
            400,
            "Both Old and New Password are required"
        );
    }

    if(oldPassword && newPassword){
        const isMatch = await admin.isPasswordCorrect(oldPassword);

        if(!isMatch){
            throw new ApiError(
                400,
                "Old Password is incorrect"
            );
        }

        admin.password = newPassword;
    }
    await admin.save();
    const UpdatedDetails = await User.findById(admin._id).select(
        "name email"
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            UpdatedDetails,
            "Admin's credentials updated successfully"
        )
    );
});

const adminLogOut = asyncHandler(async(req,res) => {
   
 const admin = await User.findById(req.user._id);

 if(!admin){
    throw new ApiError(
        400,
        "Admin not exists"
    );
 }

 admin.refreshToken = "";
 await admin.save({validateBeforeSave : false});

 const options = {
    httpOnly : true,
    secure :false,
 };

 return res
 .status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken", options)
 .json(
    new ApiResponse(
        200,
        {},
        "Admin Logout Successfully"
    )
 );
});

export {
    createAdmin,
    adminLogin,
    updateDetails,
    adminLogOut
};