require('dotenv').config();
const mongoose = require('mongoose');
const Internship = require('./models/Internship');

const generateSlug = async (role, company) => {
  const baseSlug = `${role}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  let exists = await Internship.exists({ slug });
  
  while (exists) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    exists = await Internship.exists({ slug });
  }
  
  return slug;
};

const migrateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const internships = await Internship.find({ slug: { $exists: false } });
    console.log(`Found ${internships.length} internships without slugs.`);

    let count = 0;
    for (const internship of internships) {
      const newSlug = await generateSlug(internship.role, internship.company);
      internship.slug = newSlug;
      await internship.save();
      count++;
      process.stdout.write(`\rMigrated ${count}/${internships.length}`);
    }

    console.log('\nMigration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrateSlugs();
