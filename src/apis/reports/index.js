const express = require('express');
const router = express.Router();
const reportService = require('./reportService');
const { authMiddleware } = require('../../utils/auth');
const controller = require('../../utils/controller');

// /api/reports gets added before

// Autentication
router.use(authMiddleware);

// add new report
router.post('/', controller(async (req) => {
    const {
      latitude,
      longitude,
      location,
      description,
      image
    } = req.body;

    const newPet = await reportService.createReport({
      latitude,
      longitude,
      location,
      description,
      image,
      reporter: req.user.id
    });

    return newPet;
}));

router.get('/', controller(async () => {
  return reportService.getAllReports();
}));

module.exports = router;
