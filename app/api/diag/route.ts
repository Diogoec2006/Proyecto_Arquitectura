import { NextResponse } from "next/server";
import { pool } from "../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const [tables] = await pool.execute<RowDataPacket[]>("SHOW TABLES");
        
        let usersColumns: any = null;
        let usersCount: any = null;
        let usersError: string | null = null;
        try {
            const [cols] = await pool.execute<RowDataPacket[]>("DESCRIBE users");
            usersColumns = cols.map(c => ({ Field: c.Field, Type: c.Type }));
            const [cnt] = await pool.execute<RowDataPacket[]>("SELECT COUNT(*) as count, GROUP_CONCAT(email) as emails FROM users");
            usersCount = cnt[0];
        } catch (err: any) {
            usersError = err.message || String(err);
        }

        return NextResponse.json({
            status: "ok",
            database: process.env.DATABASE_NAME,
            hasJwtSecret: Boolean(process.env.JWT_SECRET_KEY),
            jwtSecretLength: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY.length : 0,
            tables: tables.map(t => Object.values(t)[0]),
            usersColumns,
            usersCount,
            usersError
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            sqlMessage: error.sqlMessage,
            code: error.code
        }, { status: 500 });
    }
}
