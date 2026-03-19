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
//   - "gifts"    → kolom: id | nama | gambar | harga | status | diklaim_oleh | waktu_klaim
//   - "playlist"  → kolom: name | song | date
//
// Untuk sheet "gifts", isi data hadiah yang kamu mau:
//   id=1, nama=Rice Cooker, gambar=URL_GAMBAR, harga=Rp 500.000, status=available, diklaim_oleh=(kosong), waktu_klaim=(kosong)
//   id=2, nama=Blender, gambar=URL_GAMBAR, harga=Rp 350.000, status=available, diklaim_oleh=(kosong), waktu_klaim=(kosong)
//   ... dst
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
          const gifts = rows.filter(row => row[0]).map(row => ({
              id: row[0],
              nama: row[1],
              gambar: row[2],
              harga: row[3],
              status: row[4] || 'available',
              diklaim_oleh: row[5] || '',
              link: row[7] || ''
          }));
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
        const data = sheet.getDataRange().getValues();
        
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(body.id)) {
            if (data[i][4] === 'claimed') {
              return createJsonResponse({ success: false, message: 'Hadiah sudah diklaim orang lain' });
            }
            sheet.getRange(i + 1, 5).setValue('claimed');
            sheet.getRange(i + 1, 6).setValue(body.nama_tamu);
            sheet.getRange(i + 1, 7).setValue(new Date().toLocaleString('id-ID'));
            return createJsonResponse({ success: true, message: 'Hadiah berhasil diklaim' });
          }
        }
        return createJsonResponse({ success: false, message: 'Hadiah tidak ditemukan' });
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

// Auto-detect action from POST body
function detectAction(body) {
  if (body.message && body.name && !body.song && !body.attend) return 'wish';
  if (body.attend) return 'rsvp';
  if (body.id && body.nama_tamu) return 'claim_gift';
  if (body.song) return 'playlist';
  return 'unknown';
}
