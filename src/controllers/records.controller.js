import { Record } from "../models/Record.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";


const createRecord = asyncHandler(async(req,res) => {
    const { amount, type, category, date,note } = req.body;
    const types = ["income","expenses"];

    if(!amount || !types.includes(type) || !category || !date ){
        throw new ApiError(
            400,
            "Please fill the requied fields"
        );
    }

    const record = await Record.create({
       amount,
       type,
       category,
       date,
       note
    });

    return res 
     .status(201)
     .json(
        new ApiResponse(
            201,
            record,
            "Record created successfully"
        )
     );
});

const getRecord = asyncHandler(async(req,res) => {
    const {type, category,startDate, endDate} = req.query;

    let filter = {};

    if(type) filter.type = type;
    if(category) filter.category = category;
    if(startDate && endDate){
        filter.date = {
            $gte : new Date(startDate),
            $lte : new Date(endDate)
        };
    }

    const records = await Record.find(filter).sort({date : -1});

    return res 
     .status(200)
     .json(
        new ApiResponse(
            200,
            records,
            "Records Fetched successfully"
        )
     );
});

const updateRecord = asyncHandler(async(req,res) => {
    const { id } = req.params;
    const record = await Record.findById(id);

    if(!record){
        throw new ApiError(
            404,
            "Record not found"
        );
    }

    const { amount, type, category, date, note } = req.body;
    if(amount) record.amount = amount;
    if(type) record.type = type;
    if(category) record.category = category;
    if(date) record.date = date;
    if(note) record.note = note;

    await record.save();

    return res 
     .status(200)
     .json(
        new ApiResponse(
            200,
            record,
            "Record updated Successfully"
        )
     );
});

const deleteRecord = asyncHandler(async(req,res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    
    if(!record){
        throw new ApiError(
            404,
            "Record not found"
        );
    }

    await record.deleteOne();
    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            {},
            "Record deleted successfully"
        )
     );
});

export {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord
}