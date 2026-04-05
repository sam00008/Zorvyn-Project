import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({

    amount : {
        type : Number,
        required : true,
        min : 0
    },

    type : {
      type : String,
      enum : [ "income" , "expenses"],
      required : true
    },

    category : {
        type : String,
        trim : true,
        required : true
    },

    date : {
        type : Date,
        required : true
    },

    note : {
        type : String,
    },

    isDeleted : {
        type : Boolean,
        default : false
    }
}, { timestamps  :true});

RecordSchema.index({
    userId : 1
});

RecordSchema.index({
    type : 1
});

RecordSchema.index({
    category : 1
});

const Record = new mongoose.model("Record", RecordSchema);

export { Record };