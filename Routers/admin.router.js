import express from 'express';
import asyncHandler from '../utilities/asyncHandler.js';
import { cleanOrphanedDependents } from '../utilities/checkOrphanedData.js';
import { protect, restrictTo } from '../utilities/protect.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/check-integrity', asyncHandler(async (req, res) => {
  const orphaned = await cleanOrphanedDependents();
  
  res.status(200).json({
    status: 'success',
    message: 'Data integrity check completed',
    data: {
      orphanedDependents: orphaned.length,
      orphanedData: orphaned
    }
  });
}));

export default router;