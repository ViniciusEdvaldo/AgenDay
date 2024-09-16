import mongoose  from "mongoose";

const Schema= mongoose.Schema;

const pacientSchema = new Schema (
    {
        name:{
            type: String,
            required: [true, 'Pacient name is required'] 
        },
        birthDate:{
            type: Date,
            required: [true, 'birth date is required'] 
        },
        email:{
            type: String,
            required: [true, 'Pacient email is required'] 
        },
        phone:{
            type: String,
            required: [true, 'Pacient phone is required'] 
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
    }
);

const pacient = mongoose.model('Pacient', pacientSchema);
export default pacient;