# Stock Management System — PT KoperasiKuat

Technical case submission for PT MULTI POWER ADITAMA Full Stack Developer role.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Phosphor Icons
- **Backend**: NestJS + TypeORM
- **Database**: PostgreSQL 16

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16 (running on `localhost:5432`)

## Quick Start

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE stock_management;
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials (default: postgres/postgres)
npm install
npm run start:dev
```

Backend runs on `http://localhost:3001`. TypeORM auto-creates tables on first launch (`synchronize: true`).

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 4. Run Concurrency Test

```bash
node test/concurrent-transactions.js
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/barang` | List all barang |
| GET | `/api/barang/:id` | Get barang with computed stock |
| POST | `/api/barang` | Create barang |
| PUT | `/api/barang/:id` | Update barang |
| DELETE | `/api/barang/:id` | Delete barang |
| GET | `/api/transaction` | List transactions (with filters) |
| GET | `/api/transaction/:id` | Get transaction detail |
| POST | `/api/transaction` | Create transaction (add stock) |
| PATCH | `/api/transaction/:id/cancel` | Cancel transaction (reverse stock) |
| GET | `/api/transaction/sequence-preview?tanggal=YYYY-MM-DD` | Preview next sequence number |

## Sequence Number Format

`STK/<Day>/<Roman Month>/<Year>/<Running Number>`

Example: `STK/Selasa/VII/2026/00003`

- Running number resets per unique day/month/year combination
- Auto-generated or manually overridden (must be unique)
- Thread-safe via pessimistic database locking

## Database Schema

### master_barang

| Column | Type |
|---|---|
| id | UUID (PK) |
| nama_barang | VARCHAR(255) |
| sku | VARCHAR(50) UNIQUE |
| satuan_pembelian | VARCHAR(50) |
| satuan_penjualan | VARCHAR(50) |
| konversi_satuan | DECIMAL(18,6) |
| stok | DECIMAL(18,6) |

### stock_transaction

| Column | Type |
|---|---|
| id | UUID (PK) |
| nomor_transaksi | VARCHAR(50) UNIQUE |
| barang_id | UUID (FK) |
| tanggal | DATE |
| quantity | DECIMAL(18,6) |
| satuan | VARCHAR(20) |
| konversi_snapshot | DECIMAL(18,6) |
| status | VARCHAR(20) |
| keterangan | TEXT |

### sequence_counter

| Column | Type |
|---|---|
| id | UUID (PK) |
| prefix | VARCHAR(50) UNIQUE |
| last_number | INTEGER |

## Entity Relationship Diagram

```
master_barang (1) ──── (N) stock_transaction
       │
       │ (standalone)
       │
sequence_counter
```
