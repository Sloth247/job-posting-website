import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import Job from '../models/Job.js';

// @desc Get all jobs
// @routes GET /api/jobs
// @access Public
const getJobs = asyncHandler(async (req, res, next) => {
  // let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  const jobs = await Job.find(JSON.parse(queryStr));

  console.log(jobs);
  // const jobs = await Job.find({});
  res.json(jobs);

  // // Fields to exclude
  // const removeFields = ['select', 'sort', 'page', 'limit'];

  // // Loop over removeFields and delete them from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);

  // // Select Fields
  // if (req.query.select) {
  //   const fields = req.query.select.split(',').join(' ');
  //   query = query.select(fields);
  // }

  // // Sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // // Pagination
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 10;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const total = await Job.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  // // Executing query
  // const jobs = await query;

  // // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }

  // res
  //   .status(200)
  //   .json({ success: true, count: jobs.length, pagination, data: jobs });
});

// @desc Get single job
// @routes GET /api/jobs/:id
// @access Public
const getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: job });
});

// @desc Create single job
// @routes POST /api/jobs
// @access Private
const createJob = asyncHandler(async (req, res, next) => {
  const job = new Job({
    company: 'Sample company',
    logo: '/images/insure.svg',
    isNew: true,
    isFeatured: false,
    position: 'Sample position',
    role: 'Sample role',
    level: 'Sample level',
    contract: 'Full Time',
    location: 'Sample location',
    language: 'Sample language',
    tools: 'Sample language',
  });

  const createdJob = await job.save();

  res.status(201).json({
    success: true,
    data: createdJob,
  });
});

// @desc Update single job
// @routes PUT /api/jobs/:id
// @access Private
const updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    isNew: true,
    runValidators: true,
  });
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: job });
});

// @desc Delete single job
// @routes DELETE /api/jobs/:id
// @access Private
const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc Update logo image
// @routes POST /api/jobs/image
// @access Private
const updateImage = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  const image = await Job.findByIdAndUpdate(req.params.id, {
    logo: req.file.path,
  });

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  res.status(201).json({
    success: true,
    data: image,
  });
});

export { getJobs, getJob, createJob, deleteJob, updateImage, updateJob };
