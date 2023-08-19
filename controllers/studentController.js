const client = require("../config/db");
const getAllJournals = async (req, res) => {
    try{
        const student = req.user.id;
        const result = await client.query(
            `SELECT j.*
            FROM journal j
            JOIN studentJournal sj ON j.id = sj.journalId
            WHERE sj.studentId = ${student} AND j.publishedAt <= CURRENT_TIMESTAMP;
            `
        );
        if(!result){
            return res.status(400).json({
                status: 'fail',
                message: 'No journals found.',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                journals: result.rows,
            },
        });
    }
    catch(err){
        console.error('Error while fetching journals:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching journals.',
        });
    }
};

module.exports = {getAllJournals};