import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

async function migrateData() {
  console.log('🔄 Starting data migration from SQLite to MySQL...');

  // Connect to SQLite database
  const sqliteDbPath = path.join(process.cwd(), 'prisma', 'prisma', 'dev.db');
  
  if (!fs.existsSync(sqliteDbPath)) {
    console.log('⚠️  SQLite database file not found. Skipping migration.');
    return;
  }

  const sqliteDb = new Database(sqliteDbPath);
  
  // Read data from SQLite
  const sqliteData = sqliteDb.prepare('SELECT * FROM HomeContent').all() as any[];
  
  console.log(`📦 Found ${sqliteData.length} record(s) in SQLite database`);

  if (sqliteData.length === 0) {
    console.log('⚠️  No data to migrate. Exiting...');
    sqliteDb.close();
    return;
  }

  // Connect to MySQL database
  const mysqlPrisma = new PrismaClient();

  try {
    // Check if data already exists in MySQL
    const existingData = await mysqlPrisma.homeContent.findFirst();
    
    if (existingData) {
      console.log('⚠️  Data already exists in MySQL. Updating existing record...');
      
      // Update existing record with SQLite data
      for (const record of sqliteData) {
        const { id, createdAt, updatedAt, ...data } = record;
        await mysqlPrisma.homeContent.update({
          where: { id: existingData.id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        });
      }
      console.log('✅ Data updated successfully!');
    } else {
      console.log('📥 Inserting data into MySQL...');
      
      // Insert data into MySQL
      for (const record of sqliteData) {
        const { id, createdAt, updatedAt, ...data } = record;
        await mysqlPrisma.homeContent.create({
          data: {
            ...data,
            createdAt: createdAt ? new Date(createdAt) : new Date(),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
          },
        });
      }
      console.log('✅ Data migrated successfully!');
    }
  } catch (error) {
    console.error('❌ Error migrating data:', error);
    throw error;
  } finally {
    sqliteDb.close();
    await mysqlPrisma.$disconnect();
  }
}

migrateData()
  .then(() => {
    console.log('🎉 Migration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });

