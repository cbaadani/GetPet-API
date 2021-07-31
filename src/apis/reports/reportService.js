const Report = require('../../models/Report');
const ObjectId = require('../../utils/objectId');

function createReport({ 
  latitude,
  longitude,
  location,
  description,
  image,
  reporter
 }) {
    const newReport = new Report({
      latitude,
      longitude,
      location,
      description,
      image,
      reporter: ObjectId(reporter)
    });

    return newReport.save();
}

async function getAllReports() {
  const reports = await Report.find({}).populate('reporter');

  return reports.map((report) => ({
    ...report.toJSON(),
    reporter: {
      name: report.reporter.name,
      email: report.reporter.email
    }
  }));
}

module.exports = {
  createReport,
  getAllReports
};
