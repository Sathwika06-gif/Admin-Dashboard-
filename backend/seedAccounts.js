const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Account = require('./models/Account');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    importCSV();
  })
  .catch(err => console.error(err));

async function importCSV() {
  const results = [];
  const filePath = path.join(__dirname, 'data', 'accounts.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push({
        account: row.account,
        sector: row.sector,
        year_established: Number(row.year_established) || 0,
        revenue: Number(row.revenue) || 0,
        employees: Number(row.employees) || 0,
        office_location: row.office_location,
        subsidiary_of: row.subsidiary_of
      });
    })
    .on('end', async () => {
      await Account.deleteMany({});
      await Account.insertMany(results);

      const totalRevenue = results.reduce((sum, r) => sum + r.revenue, 0);

      console.log(`Inserted ${results.length} accounts`);
      console.log(`Total Revenue: ₹${totalRevenue.toLocaleString()}`);

      mongoose.connection.close();
    });
}