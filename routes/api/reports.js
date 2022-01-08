const express = require('express');
const router = express.Router();

const cron = require('node-cron');

const report = require('../../utils/report');

// @route    POST api/reports
// @desc     Start Cron
// @access   Public
router.post('/', async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  cron.schedule('0 0 0 * * *', () => {
    report();
  });

  const reportCount = await report();

  console.log(reportCount);

  res.json({
    'msg': 'successfully created daily schedule',
    'firstReportDocumentCount': reportCount
  });
});

module.exports = router;
