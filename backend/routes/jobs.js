import express from 'express';

import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobs.js';

const router = express.Router();

router.route('/').get(getJobs).post(createJob);

router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);

export default router;
