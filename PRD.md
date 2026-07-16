# Product Requirements Document (PRD)

## 1. Project Administration & Overview
* **Hiring Company**: PT MULTI POWER ADITAMA[cite: 1]
* **Target Role**: Full Stack Developer[cite: 1]
* **Project Context**: Technical Case for a Stock Management System Module utilized by PT KoperasiKuat[cite: 1]
* **Technology Stack**: Next.js (Frontend), NestJS (Backend), PostgreSQL (Database)[cite: 1]
* **Estimated Time**: 3 Days[cite: 1]
* **Deliverables Required**: Source Code, Database, Entity Relationship Diagram (ERD), and README[cite: 1]
* **Submission Format**: A publicly accessible Git repository link[cite: 1]

## 2. Background
PT KoperasiKuat operates a stock management system to record all item stock transactions[cite: 1]. Items can be purchased in wholesale quantities but sold in retail[cite: 1]. For example, purchasing 1 Drum of oil and selling 1.5 Liters[cite: 1]. Therefore, the system must be capable of storing stock in decimal format to support various unit types accurately[cite: 1].

## 3. Functional Requirements

### 3.1 Master Data (Master Barang)
* The system must include a Master Barang feature with the following minimum fields: Nama Barang, SKU, Satuan Pembelian (Wholesale Unit), Satuan Penjualan (Retail Unit), and Konversi Satuan (Conversion Value)[cite: 1].
* **Conversion Logic**: The system must calculate unit conversions based on the specified formula, establishing the conversion value as the basis for stock calculations[cite: 1].
* **Example**: For an item named "Minyak" (SKU: MYK-100), a purchase quantity of 1 Drum is converted to a sales quantity of 200 Liter, meaning the conversion value is 200 (1 Drum = 200 Liter)[cite: 1].

### 3.2 Stock Transactions (Add & Cancel)
* Users must be able to create transactions to add stock[cite: 1].
* **Required Transaction Fields**: Nomor Transaksi (sequence), Tanggal (dynamic calendar selection), Barang, Quantity, and Keterangan[cite: 1].
* **Addition Logic**: Upon successful creation of a transaction, the system must automatically add the quantity to the item's stock based on the unit used in the transaction (wholesale or retail)[cite: 1].
* **Cancellation Logic**: If a transaction is canceled, the system must precisely restore the stock by deducting the previously added quantity, utilizing the correct unit conversion[cite: 1].
* **Dynamic Management**: The system must support dynamic stock management across wholesale and retail units to ensure that stock quantity remains strictly accurate following a cancellation[cite: 1].

### 3.3 Sequence Number Generation
* Every stock addition transaction must generate an automatic Sequence Number[cite: 1].
* **Format**: `STK/<Nama Hari>/<Bulan Romawi>/<Tahun>/<Running Number>` (e.g., `STK/Senin/VII/2026/00001`)[cite: 1].
* **Reset Logic**: The running number must start from `00001` for every unique combination of Day, Month, and Year[cite: 1].
* **Manual Override**: Users are permitted to change the sequence number manually, provided the custom sequence remains strictly unique[cite: 1].
* **Validation**: If a manually inputted sequence number is already in use, the system must reject the transaction and prevent saving[cite: 1].

## 4. Technical Constraints & Architecture

### 4.1 Concurrency & Data Integrity
* The system must flawlessly handle concurrent transactions running simultaneously[cite: 1].
* Database transactions must be utilized to prevent race conditions and maintain strict data consistency[cite: 1].
* Sequence generation must remain unique, sequential, and free of duplication under multi-user conditions[cite: 1].

### 4.2 Database & API Design
* **Database**: Must feature well-designed structuring, appropriate relational mapping, and maintain data integrity and consistency[cite: 1].
* **API**: Must be strictly RESTful, consistent, easily consumable, feature comprehensive validation, and handle responses and errors correctly[cite: 1].

### 4.3 Code Quality & Project Structure
* Implement clean code methodologies, consistent naming conventions, readability, reusability, and maintainability[cite: 1].
* Must include complete README documentation detailing how to run the solution[cite: 1].
* The application must be fully runnable from scratch in under 5 minutes without requiring developer intervention[cite: 1].

## 5. Evaluation Criteria & Scoring

### 5.1 Assessment Weights
* **20% - Business Logic & Requirement Implementation**: Completeness of feature implementation per scope (master data, CRUD)[cite: 1].
* **20% - Clean Code & Project Structure**: Project structure quality, clean code application, naming consistency, readability, reusability, and maintainability[cite: 1].
* **20% - API Design**: Consistent RESTful architecture, ease of use, validation, response/error handling[cite: 1].
* **20% - Concurrent Transaction & Sequence Generation**: Concurrency handling, race condition prevention, DB transactions, safe/unique multi-user sequence generation[cite: 1].
* **15% - Database Design & Data Integrity**: Proper structure, correct relations, data consistency[cite: 1].
* **5% - Documentation**: Detailed README, application runs from scratch in under 5 minutes[cite: 1].

### 5.2 Score Bands
* **85 - 100**: Strong hire, proceed to interview[cite: 1].
* **70 - 84**: Potential, interview with technical deep-dive[cite: 1].
* **55 - 69**: Borderline, only if pipeline is thin[cite: 1].
* **< 55**: Pass[cite: 1].

### 5.3 Automatic Disqualifiers
The submission will be immediately disqualified if any of the following occur:
* Fails to include a README or installation instructions, rendering the application unable to run[cite: 1].
* The repository cannot be accessed by the assessment team[cite: 1].
* The application fails to launch due to missing dependencies, configurations, or incomplete setup steps[cite: 1].
* The source code does not use the mandated tech stack[cite: 1].
* Failure to attach a repository link, or the provided link is inaccessible[cite: 1].

## 6. Acceptance Criteria (Test Cases)

### 6.1 Master Data Stock
1. **Create Master Data**: Transactions are successfully created, and data is properly saved[cite: 1].
2. **Unit Conversion Formula**: The system successfully calculates unit conversions according to the defined formula, utilizing the conversion value as the reference for stock calculation[cite: 1].

### 6.2 Stock Additions & Reductions
1. **Create Addition Transaction**: The transaction is successfully created, and the stock is increased[cite: 1].
2. **Cancel Transaction**: The transaction is successfully canceled, and the stock is precisely returned according to the unit conversion[cite: 1].

### 6.3 Sequence Generation & Concurrency
1. **Auto Sequence**: When a user creates a transaction, the sequence automatically resolves to `STK/<Nama Hari>/<Bulan Romawi>/<Tahun>/<Running Number>` matching the selected date[cite: 1].
2. **Manual Sequence (Unique)**: When a user inputs a unique custom sequence, it is accepted and stored[cite: 1].
3. **Manual Sequence (Duplicate)**: When a user inputs an existing sequence, the system rejects it[cite: 1].
4. **Concurrent Transaction**: When 3 users create multiple transactions simultaneously, every transaction receives a unique and sequential sequence number[cite: 1].