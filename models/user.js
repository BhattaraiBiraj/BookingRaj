const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default 
    ?? require("passport-local-mongoose");

const schema = {
    email : {
        type : String,
        required : true,
    },
};

const userSchema = new mongoose.Schema(schema);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
