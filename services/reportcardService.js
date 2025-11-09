const ReportCard = require("../models/reportcard");

async function getReportCard(reportCardId){
    const reportCard = await ReportCard.findById(reportCardId).select('-expiresAt');
    return reportCard;
}