const pagination =
  (model, populate = null, customFilter = null) =>
  async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // APPLY CUSTOM FILTER
    let baseFilter = {};
    if (customFilter) {
      baseFilter = customFilter(req);
    }

    const finalFilter = { ...reqQuery, ...baseFilter };

    let queryStr = JSON.stringify(finalFilter);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    query = model.find(JSON.parse(queryStr));

    // SELECT
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    const results = await query;

    const paginationResult = {};

    if (endIndex < total) {
      paginationResult.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      paginationResult.prev = { page: page - 1, limit };
    }

    res.pagination = {
      success: true,
      count: results.length,
      pagination: paginationResult,
      data: results,
    };

    next();
  };

export default pagination;
