const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  campaignName: {
    type: String
  },
  adType: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number
  },
  clicks: {
    type: Number
  },
  asin: {
    type: String
  },
  sku: {
    type: String
  },
  cost: {
    type: Number
  },
  attributedSales1d: {
    type: Number
  },
  attributedSales7d: {
    type: Number
  },
  attributedSales14d: {
    type: Number
  },
  attributedSales30d: {
    type: Number
  },
  attributedUnitsOrdered1d: {
    type: Number
  },
  attributedUnitsOrdered7d: {
    type: Number
  },
  attributedUnitsOrdered14d: {
    type: Number
  },
  attributedUnitsOrdered30d: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('report', ReportSchema);
