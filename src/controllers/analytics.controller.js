import { Record } from "../models/Record.model";
import { ApiResponse } from "../utils/apiResponse.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";

const getSummary = asyncHandler(async(req, res) => {
    const result = await Record.aggregate([
        {
            $group:{
                _id:"$type",
                total: { $sum : "$amount"}
            }
        }
    ]);

    let income = 0;
    let expenses = 0;

    result.forEach(item => {
        if(item._id === "income") income = item.total;
        if(item.id === "expenses") expenses = item.total;
    });

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            {
                totalIncome : income,
                totalExpenses : expenses,
                netBalance : income - expenses
            },
            "Summary fetched successfully"
        )
     );
});

const getCategory = asyncHandler(async(req,res) => {
    const data = await Record.aggregate([
        {
            $group : {
                _id: "$category",
                totalAmount : { $sum : "$amount"}
            }
        },
        {
            $sort : {
                totalAmount : -1
            }
        }
    ]);

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            data,
            "category data is fetched successfully"
        )
     );
});

const getMonthly = asyncHandler(async(req,res) => {
    const data = await Record.aggregate([
        {
            $group : {
                _id: {
                    year : {$year : "$date"},
                    month : {$month : "$date"},
                    type : "$type"
                },
                total : {
                    $sum : "$amount"
                }
            }
        },
        {
            $sort : {
                "_id.year" : 1,
                "_id.month" : 1
            }
        }
    ]);

    return res 
     .status(200)
     .json(
        new ApiResponse(
            200,
            data,
            "Monthly trends data is successfully fetched"
        )
     );
});

const getRecentAcitvity = asyncHandler(async(req,res) => {
    const records = await Record.find().sort({createdAt : -1 }).limit(10);

    return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            records,
            "Recent Activity fetched Successfully"
        )
     );
});

export {
    getSummary,
    getCategory,
    getMonthly,
    getRecentAcitvity
}
