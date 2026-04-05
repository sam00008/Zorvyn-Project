import { ApiError } from "../utils/ApiError"


const authorizeRole = (allowedRole = []) => {
    return(req, res, next) =>{
        if(!req.user){
            throw new ApiError(
                401,
                "Unauthorized : User not found"
            );
        }
        
        if(!Array.isArray(allowedRole)){
            allowedRole = [allowedRole];
        }

        if(!allowedRole.includes(req.user.role)){
            throw new ApiError(
                403,
                `Forbidden: ${req.user.role} is not alllowed `
            );
        }
        next();
    }
}

export { authorizeRole };