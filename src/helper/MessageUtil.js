const MessageList = [];
MessageList["not.found.in.master"] = "{0}: {1} tidak terdaftar";
MessageList["found.duplicate"] = "data duplikat ditemukan {0} : [{1}]";
MessageList["found.duplicate.entry"] =
  "Tidak bisa menambahkan {0}, data yang dimasukkan telah terdaftar";
MessageList["not.found"] = "Data tidak ditemukan";
MessageList["found"] = "Data ditemukan";
MessageList["create"] = "{0} data berhasil dibuat";
MessageList["update"] = "{0} data berhasil diubah";
MessageList["delete"] = "{0} data berhasil dihapus";
MessageList["created"] = "Data berhasil disimpan";
MessageList["updated"] = "Data berhasil diubah";
MessageList["deleted"] = "Data berhasil dihapus";
MessageList["Permohonan Ditolak"] = "Permohonan Berhasil Ditolak";
MessageList["Permohonan Dalam Verifikasi Awal"] =
  "Permohonan Berhasil Diterima";
MessageList["Permohonan Dalam Antrian"] =
  "Proses penerimaan permohonan berhasil";
MessageList["Permohonan Dalam Proses Ekstraksi"] =
  "Proses pemeriksaan dan penugasan kasus berhasil disetujui";
MessageList["Permohonan Dalam Proses Analisis"] =
  "Proses input pemeriksaan barang bukti kasus berhasil disimpan";
MessageList["Permohonan Dalam Proses Review Laporan Pemeriksaan"] =
  "Proses input berita acara analisis barang bukti kasus berhasil disimpan";
MessageList["Permohonan Dalam Proses Revisi Laporan Pemeriksaan"] =
  "Berita acara pemeriksaan berhasil ditolak";
MessageList["Permohonan Dalam Proses Verifikasi Akhir"] =
  "Berita acara pemeriksaan berhasil disetujui";
MessageList["Permohonan Dalam Proses Serah Terima"] =
  "Proses verifikasi akhir berita acara berhasil dilakukan";
MessageList["Permohonan Selesai"] = "Proses Serah Terima Berhasil Dilakukan";
MessageList["Sinkronisasi Hasil Analisis Kasus Berhasil"] =
  "Sinkronisasi laporan hasil analisis kasus berhasil";
MessageList["Unggah Manual Hasil Analisis Kasus Berhasil"] =
  "Proses unggah laporan hasil analisis kasus berhasil";
MessageList["Format Salah Unggah Manual Hasil Analisis Kasus"] =
  "Proses unggah laporan gagal, format laporan hasil analisis kasus tidak sesuai";
MessageList["Format Salah Hasil Pemeriksaan Barang Bukti Kasus"] =
  "Proses unggah laporan gagal, format laporan hasil pemeriksaan barang bukti kasus tidak sesuai";
MessageList["Format Salah Berita Acara Hasil Analisis Barang Bukti"] =
  "Proses unggah laporan gagal, format berita acara hasil analisis barang bukti tidak sesuai";
MessageList["not.access"] = "Anda tidak memiliki akses!";

String.prototype.format = function (args) {
  var str = this;
  return str.replace(String.prototype.format.regex, function (item) {
    var intVal = parseInt(item.substring(1, item.length - 1));
    var replace;
    if (intVal >= 0) {
      replace = args[intVal];
    } else if (intVal === -1) {
      replace = "{";
    } else if (intVal === -2) {
      replace = "}";
    } else {
      replace = "";
    }
    return replace;
  });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

const GetMsg = (code, ...param) => {
  return MessageList[code].format(param);
};

module.exports = { GetMsg };
