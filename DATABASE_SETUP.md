# Database Setup Instructions

## Step 1: Check if DATABASE_URL is set

The DATABASE_URL environment variable should already be set by the Neon integration.

You can verify this in your Vercel project settings or by checking the environment variables in your deployment.

## Step 2: Create the database tables

You need to run the SQL script to create the necessary tables in your Neon database.

### Option A: Run from the v0 interface (Recommended)

The SQL script is located at `scripts/01-create-tables.sql`

### Option B: Run from Neon Console

1. Go to your Neon console at https://console.neon.tech
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the contents of `scripts/01-create-tables.sql`
5. Click "Run" to execute the script

## Step 3: Install bcryptjs

Make sure bcryptjs is installed in your project:

\`\`\`bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
\`\`\`

## Step 4: Test registration

After completing the above steps, try registering a new user. The detailed error logs will now show you exactly where the issue is occurring.

## Troubleshooting

If you still see "failed to create user", check the console logs for more detailed error messages:

- "Username must be at least 3 characters long" - Use a longer username
- "Password must be at least 6 characters long" - Use a longer password  
- "User with this email or username already exists" - Try different credentials
- Database connection errors - Check if DATABASE_URL is set correctly
- Table does not exist errors - Run the SQL script in Step 2
