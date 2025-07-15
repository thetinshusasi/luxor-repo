import { DataSource } from 'typeorm';

export const cleanDatabase = async (dataSource: DataSource): Promise<void> => {
  try {
    // Initialize the DataSource if not already initialized
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log(
      '🧹 Clearing user, bid, and collection tables (keeping schema)...'
    );

    // Clear tables in the correct order to handle foreign key constraints
    // Clear child tables first, then parent tables (bid references user and collection)
    const tablesToClear = ['bid', 'collection', 'user'];

    for (const tableName of tablesToClear) {
      try {
        // Check if table exists
        const tableExists = await dataSource.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )`,
          [tableName]
        );

        if (tableExists[0].exists) {
          // Clear all data from the table with CASCADE to handle foreign keys
          await dataSource.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
          console.log(`✅ Cleared data from table: ${tableName}`);
        } else {
          console.log(`⚠️  Table ${tableName} does not exist, skipping...`);
        }
      } catch (error: any) {
        console.error(`❌ Failed to clear table ${tableName}:`, error.message);
      }
    }

    console.log('✅ Database tables cleared successfully (schema preserved)');
  } catch (error: any) {
    console.error('❌ Database cleaning failed:', error);
  }
};
