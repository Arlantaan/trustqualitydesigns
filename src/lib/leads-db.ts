import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'leads.db');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name  TEXT NOT NULL,
    last_name   TEXT,
    email       TEXT NOT NULL,
    company     TEXT,
    message     TEXT NOT NULL,
    ip          TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT NOT NULL UNIQUE,
    source     TEXT,
    ip         TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function insertContact(data: {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  message: string;
  ip?: string;
}) {
  db.prepare(`
    INSERT INTO contact_leads (first_name, last_name, email, company, message, ip)
    VALUES (@firstName, @lastName, @email, @company, @message, @ip)
  `).run(data);
}

export function insertSubscriber(data: { email: string; source?: string; ip?: string }) {
  db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscribers (email, source, ip)
    VALUES (@email, @source, @ip)
  `).run(data);
}

export function getContacts(): ContactRow[] {
  return db.prepare(`SELECT * FROM contact_leads ORDER BY created_at DESC`).all() as ContactRow[];
}

export function getSubscribers(): SubscriberRow[] {
  return db.prepare(`SELECT * FROM newsletter_subscribers ORDER BY created_at DESC`).all() as SubscriberRow[];
}

export function getStats() {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const contactsTotal = (db.prepare(`SELECT COUNT(*) as n FROM contact_leads`).get() as { n: number }).n;
  const contactsToday = (db.prepare(`SELECT COUNT(*) as n FROM contact_leads WHERE date(created_at) = ?`).get(today) as { n: number }).n;
  const contactsWeek  = (db.prepare(`SELECT COUNT(*) as n FROM contact_leads WHERE date(created_at) >= ?`).get(weekAgo) as { n: number }).n;
  const subsTotal     = (db.prepare(`SELECT COUNT(*) as n FROM newsletter_subscribers`).get() as { n: number }).n;
  const subsWeek      = (db.prepare(`SELECT COUNT(*) as n FROM newsletter_subscribers WHERE date(created_at) >= ?`).get(weekAgo) as { n: number }).n;

  return { contactsTotal, contactsToday, contactsWeek, subsTotal, subsWeek };
}

export interface ContactRow {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  company: string | null;
  message: string;
  ip: string | null;
  created_at: string;
}

export interface SubscriberRow {
  id: number;
  email: string;
  source: string | null;
  ip: string | null;
  created_at: string;
}
