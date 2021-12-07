const Top5List = require('../models/top5list-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // community list stuff
        // if we are now publishing the top5List, make community list if doesnt exist
        if (body.isPublished && !top5List.isPublished) {
            Top5List.findOne({ name: top5List.name, isCommunityList: true }, (err, communityList) => {
                if (communityList === null) {
                    communityList = new Top5List({
                        isCommunityList: true,
                        isPublished: true,
                        name: top5List.name,
                        items: [],
                        comments: [],
                        views: 0,
                        upvotes: [],
                        downvotes: [],
                        communityListRanking: []
                    });
                }
                for (let i = 0; i < 5; i++) {
                    let element = communityList.communityListRanking.find(element => element.name === body.items[i])
                    // if this is a new element
                    if (!element) {
                        communityList.communityListRanking.push({ name: body.items[i], score: 5 - i })
                    }
                    else {
                        element.score = element.score + 5 - i
                    }
                }
                communityList.communityListRanking.sort((a, b) => (b.score > a.score) ? 1 : (a.score > b.score) ? -1 : 0)
                let auxList = []
                for (let i = 0; i < 5; i++) {
                    auxList.push(communityList.communityListRanking[i].name)
                }
                communityList.items = auxList

                communityList.save()
            })
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List.isPublished = body.isPublished
        top5List.comments = body.comments
        top5List.views = body.views
        top5List.upvotes = body.upvotes
        top5List.downvotes = body.downvotes
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if (top5List.isPublished) {
            Top5List.findOne({ name: top5List.name, isCommunityList: true }, (err, communityList) => {
                for (let i = 0; i < 5; i++) {
                    let element = communityList.communityListRanking.find(element => element.name === top5List.items[i])
                    element.score = element.score - (5 - i);
                }
                communityList.communityListRanking.sort((a, b) => (b.score > a.score) ? 1 : (a.score > b.score) ? -1 : 0)
                let auxList = []
                for (let i = 0; i < 5; i++) {
                    auxList.push(communityList.communityListRanking[i].name)
                }

                if (communityList.communityListRanking[0].score === 0) {
                    Top5List.findOneAndDelete({ _id: communityList._id }, () => {
                    }).catch(err => console.log(err))
                }
                else {
                    communityList.items = auxList

                    communityList.save()
                }
            })
        }
        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: top5List })
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    let userName = req.body.userName
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (list && (list.userName === userName || list.isPublished)) {
            return res.status(200).json({ success: true, top5List: list })
        }
        else {
            return res.status(200).json({ success: false, top5List: null })
        }
    }).catch(err => console.log(err))
}
getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        let userName = req.body.userName
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            console.log("!top5Lists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                    userName: list.userName,
                    isCommunityList: list.isCommunityList,
                    isPublished: list.isPublished,
                    comments: list.comments,
                    views: list.views,
                    upvotes: list.upvotes,
                    downvotes: list.downvotes,
                    createdAt: list.createdAt,
                    updatedAt: list.updatedAt
                };
                if (userName === pair.userName || pair.isPublished) {
                    pairs.push(pair);
                }
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById
}