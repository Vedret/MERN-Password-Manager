const mongoose=require('mongoose');

const ProfileSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups'
}]
});

module.exports=Profile=mongoose.model('Profile',ProfileSchema);