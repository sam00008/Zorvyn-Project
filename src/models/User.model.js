import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
    },

    email : { 
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique: true
    },

    password : { 
        type :String,
        required : [true,"Password is required"]
    },

    role : {
        type : String,
        enum : ["viewer", "analyst","admin"],
        default : "viewer"
    },

    status : {
        type : String,
        enum : ["active", "inactive"],
        default : "active"
    },

    isEmailVerified : {
        type : Boolean,
        default : false
    },

    refreshToken : {
        type : String
    },

    forgotPasswordToken : {
       type : String
    },

    forgotPasswordExpiry : {
        type : Date
    },

    emailVerificationToken : {
        type : String
    },

    emailVerificationExpiry : {
        type : Date
    },
}, { timestamps : true});

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
    
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        email : this.email,
        name : this.name
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
) 
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            name : this.name
        },
        process.env.REFERSH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFERSH_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

    const tokenExpiry = Date.now() + (10*60*1000);

    return {
        unHashedToken,
        hashedToken,
        tokenExpiry
    };
};

 const User = mongoose.model("User", userSchema);

 export { User };