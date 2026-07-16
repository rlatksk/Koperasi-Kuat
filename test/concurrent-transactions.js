// test/concurrent-transactions.js
const BASE = 'http://localhost:3001/api';

async function main() {
  const barangRes = await fetch(`${BASE}/barang`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nama_barang: 'Test Barang Concurrent',
      sku: `TBC-${Date.now()}`,
      satuan_pembelian: 'Box',
      satuan_penjualan: 'Pcs',
      konversi_satuan: 10,
    }),
  });
  const barang = await barangRes.json();
  console.log('Created barang:', barang.id);

  const txns = [
    { barang_id: barang.id, tanggal: '2026-07-16', quantity: 1, satuan: 'pembelian', keterangan: 'Concurrent 1' },
    { barang_id: barang.id, tanggal: '2026-07-16', quantity: 2, satuan: 'pembelian', keterangan: 'Concurrent 2' },
    { barang_id: barang.id, tanggal: '2026-07-16', quantity: 3, satuan: 'pembelian', keterangan: 'Concurrent 3' },
  ];

  const results = await Promise.all(
    txns.map((body) =>
      fetch(`${BASE}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    ),
  );

  console.log('Results:', JSON.stringify(results, null, 2));

  const allOk = results.every((r) => r.nomor_transaksi && !r.statusCode);
  if (!allOk) {
    console.error('FAIL: not all transactions succeeded');
    process.exit(1);
  }

  const sequences = results.map((r) => r.nomor_transaksi);
  const uniqueSeqs = new Set(sequences);
  if (uniqueSeqs.size !== 3) {
    console.error('FAIL: duplicate sequence numbers found:', sequences);
    process.exit(1);
  }
  console.log('PASS: all 3 sequences are unique');

  const barangCheck = await fetch(`${BASE}/barang/${barang.id}`).then((r) => r.json());
  const expectedStock = 60;
  if (Number(barangCheck.stok) !== expectedStock) {
    console.error(`FAIL: expected stock ${expectedStock}, got ${barangCheck.stok}`);
    process.exit(1);
  }
  console.log(`PASS: stock is ${barangCheck.stok} (expected ${expectedStock})`);

  console.log('All concurrency tests passed!');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
