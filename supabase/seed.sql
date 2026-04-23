-- ==========================================================
-- SEED DATA: DATA AWAL UNTUK PENGEMBANGAN LOKAL
-- ==========================================================

-- 1. Tambahkan Data Polling dan Opsi
DO $$ 
DECLARE 
    poll_id_1 UUID := uuid_generate_v4();
    poll_id_2 UUID := uuid_generate_v4();
    opt_id_1 UUID := uuid_generate_v4();
    opt_id_2 UUID := uuid_generate_v4();
BEGIN

    -- Insert Polling Pertama (Contoh Teknologi)
    INSERT INTO polls (id, question, admin_credential, created_by)
    VALUES (poll_id_1, 'Framework Frontend apa yang paling kamu sukai?', 'admin123', 'Ahmad Jawa');

    -- Insert Opsi untuk Polling Pertama
    INSERT INTO options (id, poll_id, option_text) VALUES 
    (opt_id_1, poll_id_1, 'React.js'),
    (opt_id_2, poll_id_1, 'Vue.js'),
    (uuid_generate_v4(), poll_id_1, 'Svelte');

    -- Tambahkan beberapa suara awal (Voting) untuk Polling Pertama
    INSERT INTO votes (poll_id, option_id, voter_name) VALUES 
    (poll_id_1, opt_id_1, 'Ahmad Yassin'),
    (poll_id_1, opt_id_1, 'Awil'),
    (poll_id_1, opt_id_2, 'Hasan');


    -- Insert Polling Kedua (Contoh Hiburan)
    INSERT INTO polls (id, question, admin_credential, created_by)
    VALUES (poll_id_2, 'Gunung mana yang paling ingin kamu daki?', 'admin456', 'Jawa');

    -- Insert Opsi untuk Polling Kedua
    INSERT INTO options (poll_id, option_text) VALUES 
    (poll_id_2, 'Gunung Ciremai'),
    (poll_id_2, 'Gunung Cikuray'),
    (poll_id_2, 'Gunung Prau');

END $$;