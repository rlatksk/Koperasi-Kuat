const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'stock_management',
});

const BARANG = [
  { nama: 'Beras Pandan Wangi 5kg', sku: 'BER-001', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Beras Setra Ramos 5kg', sku: 'BES-002', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Beras Merah Organik 2kg', sku: 'BEM-003', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Gula Pasir Gulaku 1kg', sku: 'GUL-004', pembelian: 'Karton', penjualan: 'Pcs', konversi: 20 },
  { nama: 'Gula Pasir Curah', sku: 'GUC-005', pembelian: 'Karung', penjualan: 'Kg', konversi: 50 },
  { nama: 'Minyak Goreng Bimoli 2L', sku: 'MIN-006', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Minyak Goreng Fortune 1L', sku: 'MIF-007', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Minyak Goreng Sania Pouch 1L', sku: 'MIS-008', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Mie Instan Indomie Goreng', sku: 'MIE-009', pembelian: 'Karton', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Mie Instan Indomie Kuah', sku: 'MIE-010', pembelian: 'Karton', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Mie Instan Sarimi Soto', sku: 'MIE-011', pembelian: 'Karton', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Mie Instan Supermi', sku: 'MIE-012', pembelian: 'Karton', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Teh Celup Sosro 25s', sku: 'TEH-013', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Teh Celup Sariwangi 25s', sku: 'TEH-014', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Teh Celup Poci 25s', sku: 'TEH-015', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Kopi Bubuk Kapal Api 165g', sku: 'KOP-016', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Kopi Bubuk ABC Susu 150g', sku: 'KOP-017', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Kopi Bubuk Torabika 150g', sku: 'KOP-018', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Susu Kental Manis Frisian Flag', sku: 'SUS-019', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Susu Kental Manis Carnation', sku: 'SUS-020', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Susu Kental Manis Omela', sku: 'SUS-021', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Susu UHT Ultra Milk 250ml', sku: 'SUU-022', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Susu UHT Indomilk 250ml', sku: 'SUU-023', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Susu UHT Frisian Flag 250ml', sku: 'SUU-024', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Tepung Terigu Segitiga Biru 1kg', sku: 'TEP-025', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tepung Terigu Cakra Kembar 1kg', sku: 'TEP-026', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tepung Terigu Kunci Biru 1kg', sku: 'TEP-027', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tepung Beras Rose Brand 500g', sku: 'TEB-028', pembelian: 'Karton', penjualan: 'Pcs', konversi: 20 },
  { nama: 'Tepung Tapioka 500g', sku: 'TET-029', pembelian: 'Karton', penjualan: 'Pcs', konversi: 20 },
  { nama: 'Tepung Maizena 300g', sku: 'TEM-030', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Roti Tawar Sari Roti 350g', sku: 'ROT-031', pembelian: 'Krat', penjualan: 'Pcs', konversi: 10 },
  { nama: 'Roti Tawar Double Soft 300g', sku: 'ROT-032', pembelian: 'Krat', penjualan: 'Pcs', konversi: 10 },
  { nama: 'Biskuit Roma Kelapa 200g', sku: 'BIS-033', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Biskuit Khong Guan Assorted 250g', sku: 'BIS-034', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Biskuit Monde Butter Cookies 200g', sku: 'BIS-035', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Sabun Mandi Lifebuoy 100g', sku: 'SAB-036', pembelian: 'Karton', penjualan: 'Pcs', konversi: 72 },
  { nama: 'Sabun Mandi Lux 100g', sku: 'SAB-037', pembelian: 'Karton', penjualan: 'Pcs', konversi: 72 },
  { nama: 'Sabun Mandi Dettol 100g', sku: 'SAB-038', pembelian: 'Karton', penjualan: 'Pcs', konversi: 72 },
  { nama: 'Sabun Mandi Shinzui 100g', sku: 'SAB-039', pembelian: 'Karton', penjualan: 'Pcs', konversi: 72 },
  { nama: 'Pasta Gigi Pepsodent 160g', sku: 'PAS-040', pembelian: 'Karton', penjualan: 'Pcs', konversi: 36 },
  { nama: 'Pasta Gigi Ciptadent 160g', sku: 'PAS-041', pembelian: 'Karton', penjualan: 'Pcs', konversi: 36 },
  { nama: 'Pasta Gigi Formula 160g', sku: 'PAS-042', pembelian: 'Karton', penjualan: 'Pcs', konversi: 36 },
  { nama: 'Sampo Sunsilk 170ml', sku: 'SAM-043', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Sampo Pantene 170ml', sku: 'SAM-044', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Sampo Clear 170ml', sku: 'SAM-045', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Sampo Dove 170ml', sku: 'SAM-046', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Wortel Berastagi', sku: 'WOR-047', pembelian: 'Karung', penjualan: 'Kg', konversi: 20 },
  { nama: 'Kentang Dieng', sku: 'WOR-048', pembelian: 'Karung', penjualan: 'Kg', konversi: 25 },
  { nama: 'Bawang Merah Brebes', sku: 'BAW-049', pembelian: 'Karung', penjualan: 'Kg', konversi: 20 },
  { nama: 'Bawang Putih Sinco', sku: 'BAW-050', pembelian: 'Karung', penjualan: 'Kg', konversi: 20 },
  { nama: 'Cabe Merah Besar', sku: 'CAB-051', pembelian: 'Karung', penjualan: 'Kg', konversi: 10 },
  { nama: 'Cabe Rawit Setan', sku: 'CAB-052', pembelian: 'Karung', penjualan: 'Kg', konversi: 10 },
  { nama: 'Tomat Segar', sku: 'TOM-053', pembelian: 'Krat', penjualan: 'Kg', konversi: 15 },
  { nama: 'Timun Segar', sku: 'TIM-054', pembelian: 'Krat', penjualan: 'Kg', konversi: 10 },
  { nama: 'Kol / Kubis', sku: 'KOL-055', pembelian: 'Karung', penjualan: 'Kg', konversi: 25 },
  { nama: 'Sawi Hijau Caisim', sku: 'SAW-056', pembelian: 'Ikat', penjualan: 'Kg', konversi: 2 },
  { nama: 'Bayam Segar', sku: 'BAY-057', pembelian: 'Ikat', penjualan: 'Kg', konversi: 2 },
  { nama: 'Kangkung', sku: 'KAN-058', pembelian: 'Ikat', penjualan: 'Kg', konversi: 2 },
  { nama: 'Telur Ayam Negeri', sku: 'TEL-059', pembelian: 'Krat', penjualan: 'Butir', konversi: 30 },
  { nama: 'Telur Ayam Kampung', sku: 'TEL-060', pembelian: 'Krat', penjualan: 'Butir', konversi: 30 },
  { nama: 'Telur Bebek', sku: 'TEL-061', pembelian: 'Krat', penjualan: 'Butir', konversi: 30 },
  { nama: 'Daging Ayam Broiler', sku: 'DAG-062', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Daging Ayam Kampung', sku: 'DAG-063', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Daging Sapi Segar', sku: 'DAG-064', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Daging Kambing', sku: 'DAG-065', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Ikan Nila Segar', sku: 'IKA-066', pembelian: 'Dus', penjualan: 'Kg', konversi: 5 },
  { nama: 'Ikan Lele Segar', sku: 'IKA-067', pembelian: 'Dus', penjualan: 'Kg', konversi: 5 },
  { nama: 'Ikan Mas Segar', sku: 'IKA-068', pembelian: 'Dus', penjualan: 'Kg', konversi: 5 },
  { nama: 'Udang Vaname', sku: 'UDA-069', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Cumi Segar', sku: 'CUM-070', pembelian: 'Frozen Pack', penjualan: 'Kg', konversi: 1 },
  { nama: 'Beras Setra Ramos 5kg', sku: 'BES-071', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Beras Merah Organik 2kg', sku: 'BEM-072', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Beras Ketan Putih 2kg', sku: 'BEK-073', pembelian: 'Karung', penjualan: 'Kg', konversi: 5 },
  { nama: 'Garam Beryodium 250g', sku: 'GAR-074', pembelian: 'Dus', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Garam Halus Refina 500gr', sku: 'GAR-075', pembelian: 'Dus', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Garam Kasar Bata', sku: 'GAR-076', pembelian: 'Dus', penjualan: 'Pcs', konversi: 40 },
  { nama: 'Kecap Manis ABC 620ml', sku: 'KEC-077', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Kecap Manis Bango 620ml', sku: 'KEC-078', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Kecap Asin ABC 620ml', sku: 'KEC-079', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Saos Sambal ABC 275ml', sku: 'SAO-080', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Saos Tomat ABC 275ml', sku: 'SAO-081', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Saos Sambal Indofood 275ml', sku: 'SAO-082', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Minyak Kayu Putih Cap Lang 60ml', sku: 'MIN-083', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Minyak Telon 100ml', sku: 'MIN-084', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Bedak Marcks 50g', sku: 'BED-085', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Bedak MBK 50g', sku: 'BED-086', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Tisu Gulung Paseo 200g', sku: 'TIS-087', pembelian: 'Bal', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tisu Gulung Nice 200g', sku: 'TIS-088', pembelian: 'Bal', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tisu Wajah Paseo 250s', sku: 'TIS-089', pembelian: 'Bal', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tisu Wajah Nice 250s', sku: 'TIS-090', pembelian: 'Bal', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Tisu Magic 4s', sku: 'TIS-091', pembelian: 'Karton', penjualan: 'Pcs', konversi: 48 },
  { nama: 'Deterjen Rinso 900g', sku: 'DET-092', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Deterjen SoKlin Liquid 750ml', sku: 'DET-093', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Deterjen Daia 900g', sku: 'DET-094', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Pewangi Pakaian Molto 800ml', sku: 'PEW-095', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Sunlight Pencuci Piring 755ml', sku: 'SUN-096', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Pembersih Lantai Super Pell', sku: 'PEM-097', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Karbol Wangi Wipol', sku: 'KAR-098', pembelian: 'Karton', penjualan: 'Pcs', konversi: 12 },
  { nama: 'Pengharum Ruangan Stella 225ml', sku: 'PEN-099', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
  { nama: 'Air Mineral Aqua 600ml', sku: 'AIR-100', pembelian: 'Karton', penjualan: 'Pcs', konversi: 24 },
];

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function pad(n) {
  return String(n).padStart(5, '0');
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await client.connect();

  // Start from clean slate
  await client.query('DELETE FROM stock_transaction');
  await client.query('DELETE FROM master_barang');
  await client.query('DELETE FROM sequence_counter');

  const barangIds = [];

  // Insert 100 barang and generate 3 transactions each
  for (let i = 0; i < BARANG.length; i++) {
    const b = BARANG[i];
    const id = crypto.randomUUID();
    barangIds.push({ id, ...b });

    const stok = randomBetween(20, 200) * b.konversi;
    await client.query(
      `INSERT INTO master_barang (id, nama_barang, sku, satuan_pembelian, satuan_penjualan, konversi_satuan, stok)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, b.nama, b.sku, b.pembelian, b.penjualan, b.konversi, stok],
    );

    // Generate 3 pembelian transactions per barang on random dates
    for (let t = 0; t < 3; t++) {
      const dayOffset = randomBetween(-30, -1);
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const prefix = `STK/${DAYS[date.getDay()]}/${ROMAN[date.getMonth() + 1]}/${yyyy}`;
      const seqRow = await client.query(
        'SELECT last_number FROM sequence_counter WHERE prefix = $1',
        [prefix],
      );
      let seq = 1;
      if (seqRow.rows.length > 0) {
        seq = Number(seqRow.rows[0].last_number) + 1;
        await client.query('UPDATE sequence_counter SET last_number = $1 WHERE prefix = $2', [seq, prefix]);
      } else {
        await client.query('INSERT INTO sequence_counter (id, prefix, last_number) VALUES ($1, $2, $3)', [
          crypto.randomUUID(), prefix, seq,
        ]);
      }

      const nomor = `${prefix}/${pad(seq)}`;
      const qty = randomBetween(1, 10);

      await client.query(
        `INSERT INTO stock_transaction (id, nomor_transaksi, barang_id, tanggal, quantity, tipe, satuan, konversi_snapshot, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [crypto.randomUUID(), nomor, id, dateStr, qty, 'pembelian', b.pembelian, b.konversi, 'ACTIVE'],
      );
    }
  }

  console.log(`Seeded ${await client.query('SELECT count(*) FROM master_barang').then(r => r.rows[0].count)} barang`);
  console.log(`Seeded ${await client.query('SELECT count(*) FROM stock_transaction').then(r => r.rows[0].count)} transactions`);

  await client.end();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
