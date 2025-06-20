import { time } from 'console';
import { required } from 'joi';
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
/**
 * UserSchema
 * @description User model
 */

const UserSchema = new Schema({

    first_name: {
        type: String,
        required: [true, 'first name must not be empty'],
    },
    last_name: {
        type: String,
        required: [true, 'last name must not be empty'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email must not be empty']
    },
    password: {
        type: String
    },
    phone_number: {
        type: String,
        unique: true
    },
    wallet_address: {
        type: [String], 
        default: []
    },
    full_address: {
        type: String,
        required: [true, 'address must not be empty']
    },
    city: {
        type: String,
        required: [true, 'city must not be empty']
    },
    country_code: {
        type: String,
        required: [true, 'country code must not be empty']
    },
    country: {
        type: String,
        required: [true, 'country must not be empty']
    },
    state: {
        type: String,
        required: [true, 'state must not be empty']
    },
    zip_code: {
        type: String,
        required: [true, 'zip_code must not be empty']
    },
    is_being_affilate: {
        type: Boolean,
        default: false
    },
    affilate_code: {
        type: String,
        // unique: true
    },
    reference_affilate_code: {
        type: String
    },
    is_being_campaigner: {
        type: Boolean,
        default: false
    },
    campaigner_code: {
        type: String,
        // unique: true
    },
    usdt_raised: {
        type: Number,
    },  
    timestamp: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    date: {
        type: String
    },
    kyc_document: {
        type: Array
    },
    kyc_verified: {   // 0 - pending , 1 - verified, 2 - rejected
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
    applicant_id: {
        type: String
    },
    work_flow_run_id: {
        type: String
    },
    upload_status: {
        type: String
    },
    verification_status: {
        type: String,
        default: "pending"
    },
    token_purchased: {
        type: Number,
        default: 0
    },
    reset_token: {
        type: String
    },
    token_expires: {
        type: String
    },
    document_uploaded: {
        type: Boolean,
        default: false
    },
    wallet_id: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }

}, { versionKey: false });

UserSchema.plugin(mongoosePaginate);
export const User = model('user', UserSchema);