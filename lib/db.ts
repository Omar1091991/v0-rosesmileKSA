import { sql } from "@vercel/postgres"

export async function query(text: string, params?: any[]) {
  try {
    console.log("[v0] Executing query:", text.substring(0, 100) + "...")

    // @vercel/postgres uses tagged template literals
    // Convert parameterized query to template literal format
    let finalQuery = text
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        const placeholder = `$${index + 1}`
        const value = typeof param === "string" ? `'${param.replace(/'/g, "''")}'` : param
        finalQuery = finalQuery.replace(placeholder, String(value))
      })
    }

    const result = await sql.query(finalQuery)
    console.log("[v0] Query successful, returned", result.rows.length, "rows")

    return result
  } catch (error: any) {
    console.error("[v0] Database query error:", error.message)
    console.error("[v0] Query was:", text.substring(0, 200))
    throw error
  }
}

export const db = {
  query,
}
