-- Bikin tabel di supabase
CREATE TABLE test_drives_new (
    id BIGSERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    police_number TEXT NOT NULL,
    car_model TEXT NOT NULL,
    notes TEXT,
    front_photo TEXT,
    back_photo TEXT,
    left_photo TEXT,
    right_photo TEXT,
    mid_photo TEXT,
    form_photo TEXT,
    status TEXT NOT NULL DEFAULT 'OUT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Langkah langkah RLS
-- Enable RLS
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (jika diperlukan authentication)
CREATE POLICY "Allow public read access" ON test_drives
    FOR SELECT USING (true);

-- Policy untuk insert  
CREATE POLICY "Allow public insert access" ON test_drives
    FOR INSERT WITH CHECK (true);

-- Policy untuk update
CREATE POLICY "Allow public update access" ON test_drives
    FOR UPDATE USING (true);

-- Policy untuk delete
CREATE POLICY "Allow public delete access" ON test_drives
    FOR DELETE USING (true);

-- Cek Tabel
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'test_drives' 
ORDER BY ordinal_position;