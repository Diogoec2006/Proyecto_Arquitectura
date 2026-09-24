import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to")
    
    if (!from || !to) {
        return NextResponse.json({ error: "Missing Params" }, { status: 400 })
    }

    try {
        const kpiSql = `SELECT
            COUNT(DISTINCT u.user_id) AS total_signups,
            COUNT(DISTINCT CASE WHEN u.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND THEN u.user_id END) AS new_signups,
            COUNT(DISTINCT CASE WHEN u.is_banned = 1 THEN u.user_id END) AS banned_users,
            COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND THEN 1 END) AS total_bookings,
            ROUND(COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'cancelled' THEN 1 END) * 100
                / NULLIF(COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND THEN 1 END), 0), 1) AS cancelled_percentage,
            ROUND(COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'no_show' THEN 1 END) * 100
                / NULLIF(COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND THEN 1 END), 0), 1) AS no_show_percentage
            FROM users u
            LEFT JOIN bookings b ON u.user_id = b.user_id
        `

        
        const kpiParams = Array(6).fill([from, to]).flat();
        const [kpiRows] = await pool.execute<RowDataPacket[]>(kpiSql, kpiParams);
        const kpiData = kpiRows[0] as KpiData;
                
        const bookingsBreakdownSql = `SELECT
            COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'confirmed' THEN 1 END) AS confirmed_bookings,
            COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'completed' THEN 1 END) AS completed_bookings,
            COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'cancelled' THEN 1 END) AS cancelled_bookings,
            COUNT(CASE WHEN b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND AND b.booking_status = 'no_show' THEN 1 END) AS no_show_bookings
            FROM bookings b
        `
        const bookingsBreakdownParams = Array(4).fill([from, to]).flat();
        const [bookingsBreakdownRows] = await pool.execute<RowDataPacket[]>(bookingsBreakdownSql, bookingsBreakdownParams);
        const bookingsBreakdownData = bookingsBreakdownRows[0] as BookingsBreakdownData;

        const sportsBreakdownSql = `SELECT c.sport, COUNT(*) AS total
            FROM bookings b
            JOIN courts c ON b.court_id = c.court_id
            WHERE b.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY) - INTERVAL 1 SECOND
            GROUP BY c.sport
        `
        const [sportsBreakdownRows] = await pool.execute<RowDataPacket[]>(sportsBreakdownSql, [from, to]);
        const sportsBreakdownData = sportsBreakdownRows as SportBreakdownData[];

        const heatMapSql = `SELECT 
                DAYOFWEEK(booked_date) AS day_of_week,
                HOUR(booked_time) AS booked_hour,
                COUNT(*) AS booking_count
                FROM bookings
                WHERE booking_status = 'completed'
                AND booked_date BETWEEN ? AND ?
                GROUP BY day_of_week, booked_hour
                ORDER BY day_of_week, booked_hour
        `
        const [heatMapRows] = await pool.execute<RowDataPacket[]>(heatMapSql, [from, to]);

        const heatMapMatrix = Array.from({ length: 7 }, () => Array(24).fill(0))

        for (const row of heatMapRows) {
            const day = row.day_of_week === 1 ? 6 : row.day_of_week - 2 // Make it so that week starts on monday with index 0-6
            const hour = row.booked_hour;
            heatMapMatrix[day][hour] = row.booking_count
        }

        const courtsSql = "SELECT COUNT(DISTINCT court_id) AS total_courts FROM courts";
        const [courtRows] = await pool.execute(courtsSql)
        const totalCourts = (courtRows as {total_courts: number}[])[0].total_courts

        const heatMapData = {heatMapMatrix, totalCourts}

        return NextResponse.json({ kpiData, bookingsBreakdownData, sportsBreakdownData, heatMapData }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}