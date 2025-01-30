const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Ambil semua data sesi
router.get("/", (req, res) => {
    const query = `
SELECT 
    sesi.id_sesi,
    sesi.id_pasien,
    sesi.id_terapis,
    sesi.id_jenisTrapi, 
    pasien.nama_pasien AS nama_pasien, 
    terapis.nama_terapis AS nama_terapis, 
    jenisTrapi.nama_jenisTrapi AS nama_jenisTrapi, 
    sesi.tanggal_sesi, 
    sesi.catatan_sesi
FROM sesi
INNER JOIN pasien ON sesi.id_pasien = pasien.id_pasien
INNER JOIN terapis ON sesi.id_terapis = terapis.id_terapis
INNER JOIN jenisTrapi ON sesi.id_jenisTrapi = jenisTrapi.id_jenisTrapi
ORDER BY sesi.id_sesi DESC;
    `;
    connection.query(query, (err, rows) => {
        if (!err) {
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows,
            });
        } else {
            console.error("Error fetching sessions:", err);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        }
    });
});


// Simpan data sesi
router.post(
    "/store",
    [
        body("id_pasien").notEmpty(),
        body("id_terapis").notEmpty(),
        body("id_jenisTrapi").notEmpty(),
        body("tanggal_sesi").notEmpty().custom((value) => {
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}?$/;
            if (!dateTimeRegex.test(value.trim())) {
                throw new Error("Format tanggal_sesi harus YYYY-MM-DD HH:MM");
            }
            return true;
        }),
        body("catatan_sesi").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        const { id_pasien, id_terapis, id_jenisTrapi } = req.body;

        let finalTanggalSesi = req.body.tanggal_sesi.trim();
        if (/^\d{2}:\d{2}$/.test(finalTanggalSesi)) {
            const today = new Date().toISOString().split("T")[0];
            finalTanggalSesi = `${today} ${finalTanggalSesi}:00`;
        }

        connection.query(
            "SELECT id_pasien FROM pasien WHERE id_pasien = ?",
            [id_pasien],
            (err, pasienResult) => {
                if (err || pasienResult.length === 0) {
                    return res.status(400).json({ status: false, message: "Invalid id_pasien" });
                }

                connection.query(
                    "SELECT id_terapis FROM terapis WHERE id_terapis = ?",
                    [id_terapis],
                    (err, terapisResult) => {
                        if (err || terapisResult.length === 0) {
                            return res.status(400).json({ status: false, message: "Invalid id_terapis" });
                        }

                        connection.query(
                            "SELECT id_jenisTrapi FROM jenisTrapi WHERE id_jenisTrapi = ?",
                            [id_jenisTrapi],
                            (err, jenisTrapiResult) => {
                                if (err || jenisTrapiResult.length === 0) {
                                    return res.status(400).json({ status: false, message: "Invalid id_jenisTrapi" });
                                }

                                const formData = {
                                    id_pasien: req.body.id_pasien,
                                    id_terapis: req.body.id_terapis,
                                    id_jenisTrapi: req.body.id_jenisTrapi,
                                    tanggal_sesi: finalTanggalSesi, // Menggunakan tanggal_sesi yang sudah diformat
                                    catatan_sesi: req.body.catatan_sesi,
                                };

                                connection.query("INSERT INTO sesi SET ?", formData, (err, rows) => {
                                    if (err) {
                                        console.error("Database Insert Error: ", err);
                                        return res.status(500).json({
                                            status: false,
                                            message: "Internal Server Error",
                                            errors: err.sqlMessage,
                                        });
                                    } else {
                                        formData.id_sesi = rows.insertId;
                                        return res.status(201).json({
                                            status: true,
                                            message: "Data sesi Created",
                                            data: formData,
                                        });
                                    }
                                });
                            }
                        );
                    }
                );
            }
        );
    }
);

// Ambil detail sesi berdasarkan ID
router.get("/:id_sesi", (req, res) => {
    const id_sesi = req.params.id_sesi;
    if (!id_sesi) {
        return res.status(400).json({
            status: false,
            message: "Missing id_sesi parameter",
        });
    }
    const query = `
        SELECT 
        sesi.id_sesi,
        sesi.id_pasien,
        sesi.id_terapis,
        sesi.id_jenisTrapi, 
        pasien.nama_pasien AS nama_pasien, 
        terapis.nama_terapis AS nama_terapis, 
        jenisTrapi.nama_jenisTrapi AS nama_jenisTrapi, 
        sesi.tanggal_sesi, 
        sesi.catatan_sesi
        FROM sesi
        INNER JOIN pasien ON sesi.id_pasien = pasien.id_pasien
        INNER JOIN terapis ON sesi.id_terapis = terapis.id_terapis
        INNER JOIN jenisTrapi ON sesi.id_jenisTrapi = jenisTrapi.id_jenisTrapi
        WHERE sesi.id_sesi = ?;
    `;
    connection.query(query, [id_sesi],(err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows[0],
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Sesi Not Found",
            });
        }
    });
});

// Update data sesi
router.put(
    "/:id_sesi",
    [
        body("id_pasien").notEmpty(),
        body("id_terapis").notEmpty(),
        body("id_jenisTrapi").notEmpty(),
        body("tanggal_sesi").notEmpty(),
        body("catatan_sesi").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }

        const id_sesi = req.params.id_sesi;
        const formData = {
            id_pasien: req.body.id_pasien,
            id_terapis: req.body.id_terapis,
            id_jenisTrapi: req.body.id_jenisTrapi,
            tanggal_sesi: req.body.tanggal_sesi,
            catatan_sesi: req.body.catatan_sesi,
        };

        connection.query("UPDATE sesi SET ? WHERE id_sesi = ?", [formData, id_sesi], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Internal Server Error",
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: "Data sesi Updated Successfully",
                    data: formData,
                });
            }
        });
    }
);

// Hapus data sesi
router.delete("/:id_sesi", (req, res) => {
    const id_sesi = req.params.id_sesi;
    connection.query("DELETE FROM sesi WHERE id_sesi = ?", [id_sesi], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data sesi Deleted Successfully",
            });
        }
    });
});

module.exports = router;