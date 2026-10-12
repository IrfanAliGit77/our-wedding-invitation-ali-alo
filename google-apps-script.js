// ============================================================
// GOOGLE APPS SCRIPT — Backend Undangan Digital
// ============================================================
// 
// CARA PAKAI:
// 1. Buka Google Sheets baru → Extensions → Apps Script
// 2. Hapus semua kode default
// 3. Paste SEMUA kode di bawah ini
// 4. Klik Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy URL deployment-nya, paste ke CONFIG di index.html
//
// PENTING: Buat 4 Sheet (tab) di Google Sheets kamu:
//   - "wishes"   → kolom: name | message | date
//   - "rsvp"     → kolom: name | attend | jumlah | date
//   - "gifts"    → kolom: id | nama | gambar | harga | status | diklaim_oleh | waktu_klaim | link | qty | terklaim
//   - "playlist"  → kolom: name | song | date
//
// Untuk sheet "gifts", isi data hadiah yang kamu mau (kolom A sampai J):
//   A id        : 1, 2, 3 ... (unik)
//   B nama      : Rice Cooker
//   C gambar    : URL gambar (boleh kosong)
//   D harga     : Rp 500.000
//   E status    : available   (diisi otomatis jadi "claimed" kalau jumlahnya sudah terpenuhi)
//   F diklaim_oleh : kosongkan (diisi otomatis, nama-nama pemberi dipisah koma)
//   G waktu_klaim  : kosongkan (diisi otomatis)
//   H link      : link Tokopedia/Shopee (boleh kosong)
//   I qty       : berapa buah yang dibutuhkan, misal 3 (kosong = 1)
//   J terklaim  : kosongkan (diisi otomatis: sudah berapa buah yang diberikan)
//
// Hadiah tetap bisa dipilih tamu lain selama terklaim < qty.
// ============================================================

// Enable CORS
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ GET HANDLER ============
function doGet(e) {
  const action = e.parameter.action || 'wishes';
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    switch (action) {
      case 'wishes': {
        const sheet = ss.getSheetByName('wishes');
        if (!sheet) return createJsonResponse({ wishes: [] });
        const [headers, ...rows] = sheet.getDataRange().getValues();
        const wishes = rows.map(row => ({
          name: row[0],
          message: row[1],
          date: row[2]
        }));
        return createJsonResponse({ wishes });
      }

      case 'gifts': {
          const sheet = ss.getSheetByName('gifts');
          if (!sheet) return createJsonResponse({ gifts: [] });
          const [headers, ...rows] = sheet.getDataRange().getValues();
          const gifts = rows.filter(row => row[0]).map(row => publicGift(giftFromRow(row)));
          return createJsonResponse({ gifts });
      }

      case 'playlist': {
        const sheet = ss.getSheetByName('playlist');
        if (!sheet) return createJsonResponse({ songs: [] });
        const [headers, ...rows] = sheet.getDataRange().getValues();
        const songs = rows.map(row => ({
          name: row[0],
          song: row[1],
          date: row[2]
        }));
        return createJsonResponse({ songs });
      }

      case 'rsvp': {
        const sheet = ss.getSheetByName('rsvp');
        if (!sheet) return createJsonResponse({ rsvps: [] });
        const [headers, ...rows] = sheet.getDataRange().getValues();
        const rsvps = rows.map(row => ({
          name: row[0],
          attend: row[1],
          jumlah: row[2],
          date: row[3]
        }));
        return createJsonResponse({ rsvps });
      }

      default:
        return createJsonResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

// ============ POST HANDLER ============
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || detectAction(body);

    switch (action) {
      case 'wish': {
        const sheet = ss.getSheetByName('wishes');
        if (!sheet) throw new Error('Sheet "wishes" tidak ditemukan');
        sheet.appendRow([body.name, body.message, body.date || new Date().toLocaleString('id-ID')]);
        return createJsonResponse({ success: true, message: 'Ucapan berhasil dikirim' });
      }

      case 'rsvp': {
        const sheet = ss.getSheetByName('rsvp');
        if (!sheet) throw new Error('Sheet "rsvp" tidak ditemukan');
        sheet.appendRow([body.name, body.attend, body.jumlah, body.date || new Date().toLocaleString('id-ID')]);
        return createJsonResponse({ success: true, message: 'RSVP berhasil dikirim' });
      }

      case 'claim_gift': {
        const sheet = ss.getSheetByName('gifts');
        if (!sheet) throw new Error('Sheet "gifts" tidak ditemukan');
        // Dikunci supaya dua tamu yang menekan bersamaan tidak sama-sama mendapat jatah terakhir
        const lock = LockService.getScriptLock();
        lock.waitLock(20000);
        try {
          const data = sheet.getDataRange().getValues();
          for (let i = 1; i < data.length; i++) {
            if (String(data[i][0]) !== String(body.id)) continue;
            const g = giftFromRow(data[i]);
            if (g.sisa <= 0) {
              return createJsonResponse(Object.assign({ success: false, message: 'Maaf, hadiah ini sudah diklaim oleh tamu lain.' }, publicGift(g)));
            }
            const nama = String(body.nama_tamu || 'Tamu').replace(/^[=+\-@]+/, '').trim().slice(0, 60) || 'Tamu';
            const waktu = new Date().toLocaleString('id-ID');
            const names = g.pemberi.concat([nama]);
            const times = String(data[i][6] || '').split(' | ').filter(String).concat([waktu]);
            const terklaim = g.terklaim + 1;
            const status = terklaim >= g.qty ? 'claimed' : 'available';
            sheet.getRange(i + 1, 5, 1, 3).setValues([[status, names.join(', '), times.join(' | ')]]);   // E, F, G
            sheet.getRange(i + 1, 10).setValue(terklaim);                                             // J
            const row = data[i].slice();
            row[4] = status; row[5] = names.join(', '); row[9] = terklaim;
            return createJsonResponse(Object.assign({ success: true, message: 'Hadiah berhasil diklaim' }, publicGift(giftFromRow(row))));
          }
          return createJsonResponse({ success: false, message: 'Hadiah tidak ditemukan' });
        } finally {
          lock.releaseLock();
        }
      }

      case 'playlist': {
        const sheet = ss.getSheetByName('playlist');
        if (!sheet) throw new Error('Sheet "playlist" tidak ditemukan');
        sheet.appendRow([body.name, body.song, body.date || new Date().toLocaleString('id-ID')]);
        return createJsonResponse({ success: true, message: 'Lagu berhasil di-request' });
      }

      default:
        return createJsonResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

// Satu baris sheet "gifts" -> data hadiah lengkap dengan jumlah & sisa
function giftFromRow(row) {
  const qty = Math.max(1, parseInt(row[8], 10) || 1);
  const pemberi = String(row[5] || '').split(',').map(function (x) { return x.trim(); }).filter(String);
  // kolom J kosong (data lama): hitung dari jumlah nama pemberi
  let terklaim = (row[9] === '' || row[9] === null || row[9] === undefined) ? pemberi.length : (parseInt(row[9], 10) || 0);
  if (terklaim === 0 && String(row[4]).toLowerCase() === 'claimed' && !pemberi.length) terklaim = qty;   // ditandai manual "claimed"
  const sisa = Math.max(0, qty - terklaim);
  return {
    id: row[0], nama: row[1], gambar: row[2], harga: row[3],
    status: sisa <= 0 ? 'claimed' : 'available',
    diklaim_oleh: pemberi.join(', '), pemberi: pemberi,
    link: row[7] || '',
    qty: qty, terklaim: Math.min(terklaim, qty), sisa: sisa
  };
}

// Yang boleh dilihat tamu: tanpa nama pemberi (tetap anonim). Nama hanya tersimpan di Sheet.
function publicGift(g) {
  return { id: g.id, nama: g.nama, gambar: g.gambar, harga: g.harga, status: g.status, link: g.link };
}

// Auto-detect action from POST body
function detectAction(body) {
  if (body.message && body.name && !body.song && !body.attend) return 'wish';
  if (body.attend) return 'rsvp';
  if (body.id && body.nama_tamu) return 'claim_gift';
  if (body.song) return 'playlist';
  return 'unknown';
}