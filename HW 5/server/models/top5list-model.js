const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        isCommunityList: { type: Boolean, required: true },
        isPublished: { type: Boolean, required: true },
        name: { type: String, required: true },
        items: { type: [String], required: true },
        userName: { type: String },
        comments: { type: [Object] },
        views: { type: Number },
        upvote: { type: [String] },
        downvote: { type: [String] },
        communityListRanking: { type: [Object] }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
