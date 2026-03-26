import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Read the schema SQL file
    const schemaPath = join(process.cwd(), 'lib', 'supabase', 'schema.sql')
    const sql = readFileSync(schemaPath, 'utf-8')

    return NextResponse.json({
      message:
        'Copy the SQL below and paste it into your Supabase SQL Editor (Dashboard > SQL Editor > New Query)',
      instructions: [
        '1. Go to https://supabase.com/dashboard → your project → SQL Editor',
        '2. Click "New Query"',
        '3. Paste the entire SQL below',
        '4. Click "Run" to create all tables, RLS policies, and triggers',
      ],
      sql,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to read schema file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
