const db = require('../config/db');
const getAllJournals = async (req, res) => {
    try {
        const student = req.user.id;
        const result = await db.select('j.*')
            .from('journal as j')
            .join('studentjournal as sj', 'j.id', 'sj.journalid')
            .where('sj.studentid', student)
            .andWhere('j.publishedat', '<=', db.raw('CURRENT_TIMESTAMP'));

        if (result.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No journals found.',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                journals: result,
            },
        });
    } catch (err) {
        console.error('Error while fetching journals:', err);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching journals.',
        });
    }
};

module.exports = { getAllJournals };
