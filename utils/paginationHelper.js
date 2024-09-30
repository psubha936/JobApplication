exports.paginateResults = async (model, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const results = await model.find().sort({ appliedDate: -1 }).limit(limit).skip(skip);
    return results;
};
