# Stock Management System — PT KoperasiKuat

Technical case submission for PT MULTI POWER ADITAMA Full Stack Developer role.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + Phosphor Icons
- **Backend**: NestJS 11 + TypeORM
- **Database**: PostgreSQL 16

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16 running on `localhost:5432`

## Quick Start (under 5 minutes)

### 1. Create Database

```sql
CREATE DATABASE stock_management;
```

### 2. Restore Database Dump (with sample data — 100 barang + 300 transactions)

```bash
psql -U postgres -d stock_management < database.sql
```

Replace `postgres` with your PostgreSQL username.

### 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials (defaults: postgres/postgres)
npm install
npm run start:dev
```

Backend runs on `http://localhost:3001`.

### 4. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Alternative: Seed from Scratch

If you prefer to start with empty tables (no dump), skip step 2. TypeORM auto-creates tables on first launch (`synchronize: true`). Then seed sample data:

```bash
cd backend
node seed.js
```

## Features

### Master Barang
- CRUD operations for inventory items
- Server-side search by nama_barang or SKU (case-insensitive)
- Server-side pagination (10 items per page)
- Stock displayed in both retail and wholesale units
- SKU uniqueness validation

### Transaksi
- **Stok Masuk (Pembelian)** — adds stock; supports both wholesale and retail units
- **Stok Keluar (Penjualan)** — subtracts stock; supports both wholesale and retail units
- Unit conversion applied automatically (e.g., 1 Karung = 5 Kg)
- Cancel transaction with accurate stock reversal
- Filters: by barang, status, date range
- Auto-generated sequence number: `STK/<Hari>/<Bulan Romawi>/<Tahun>/<Running>`
- Manual sequence override (must be unique)
- Transaction-scoped database locks prevent race conditions

### Dashboard
- Total barang count
- Total stock (in retail units)

## API Endpoints

### Barang

| Method | Route | Query Params | Description |
|---|---|---|---|
| GET | `/api/barang` | `search`, `page`, `limit` | List barang (paginated) |
| GET | `/api/barang/:id` | | Get barang detail |
| POST | `/api/barang` | | Create barang |
| PUT | `/api/barang/:id` | | Update barang |
| DELETE | `/api/barang/:id` | | Delete barang |

### Transaction

| Method | Route | Query Params | Description |
|---|---|---|---|
| GET | `/api/transaction` | `barang_id`, `status`, `tanggal_from`, `tanggal_to`, `page`, `limit` | List transactions |
| GET | `/api/transaction/:id` | | Get transaction detail |
| POST | `/api/transaction` | | Create transaction |
| PATCH | `/api/transaction/:id/cancel` | | Cancel transaction |
| GET | `/api/transaction/sequence-preview` | `tanggal` | Preview next sequence number |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "SKU already exists"
}
```

## Sequence Number Format

`STK/<Hari>/<Bulan Romawi>/<Tahun>/<Running Number>`

Example: `STK/Selasa/VII/2026/00003`

- Running number starts from `00001` per unique day/month/year combination
- Auto-generated or manually overridden (must be unique, server-validated)
- Concurrent-safe: `SELECT ... FOR UPDATE` pessimistic lock on `sequence_counter` table

## Database Schema

### master_barang

| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | |
| nama_barang | VARCHAR(255) | Item name |
| sku | VARCHAR(50) UNIQUE | Stock Keeping Unit |
| satuan_pembelian | VARCHAR(50) | Wholesale unit (e.g., Karung) |
| satuan_penjualan | VARCHAR(50) | Retail unit (e.g., Kg) |
| konversi_satuan | DECIMAL(18,6) | 1 wholesale = N retail |
| stok | DECIMAL(18,6) | Current stock (in retail units) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### stock_transaction

| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | |
| nomor_transaksi | VARCHAR(50) UNIQUE | Sequence number |
| barang_id | UUID (FK → master_barang) | |
| tanggal | DATE | Transaction date |
| quantity | DECIMAL(18,6) | Quantity in the chosen unit |
| tipe | VARCHAR(20) | pembelian / penjualan |
| satuan | VARCHAR(50) | Unit name (e.g., Karung, Kg) |
| konversi_snapshot | DECIMAL(18,6) | Frozen conversion at transaction time |
| status | VARCHAR(20) | ACTIVE / CANCELLED |
| keterangan | TEXT | Optional notes |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### sequence_counter

| Column | Type | Description |
|---|---|---|
| id | UUID (PK) | |
| prefix | VARCHAR(50) UNIQUE | e.g., STK/Senin/VII/2026 |
| last_number | INTEGER | Last running number used |

## Concurrency

All transaction creation runs inside a TypeORM database transaction with `pessimistic_write` lock on the `sequence_counter` row. This guarantees:

- No duplicate sequence numbers
- No lost stock updates
- Atomic stock + sequence + transaction insert

Test with:

```bash
node test/concurrent-transactions.js
```

## Project Structure

```
├── backend/          # NestJS API server (port 3001)
│   ├── src/
│   │   ├── barang/   # Master barang module
│   │   ├── transaction/ # Transaction module
│   │   └── shared/   # Utilities (roman, sequence)
│   ├── seed.js       # Database seed script
│   └── .env.example
├── frontend/         # Next.js 16 App Router (port 3000)
│   └── src/
│       ├── app/      # Pages (dashboard, barang, transaction)
│       ├── components/ # Reusable UI components
│       ├── lib/      # API client
│       └── types/    # TypeScript types
├── test/             # Concurrency test script
├── database.sql      # PostgreSQL dump with sample data
└── README.md
```