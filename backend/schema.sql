-- =========================================================
-- DATABASE
-- =========================================================

-- CREATE DATABASE hospital_management_db;

-- Connect to the database before running the rest:
-- \c hospital_management_db


-- =========================================================
-- ENUM TYPES
-- =========================================================

CREATE TYPE gender_type AS ENUM (
    'M',
    'F'
);

CREATE TYPE bed_status AS ENUM (
    'AVAILABLE',
    'OCCUPIED',
    'MAINTENANCE'
);

CREATE TYPE admission_request_status AS ENUM (
    'PENDING',
    'APPROVED',
    'BED_ASSIGNED',
    'REJECTED',
    'CANCELLED'
);

CREATE TYPE admission_status AS ENUM (
    'ACTIVE',
    'DISCHARGED',
    'CANCELLED'
);


-- =========================================================
-- 1. HOSPITALS
-- =========================================================

CREATE TABLE hospitals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. ROLES
-- =========================================================

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. USERS
-- =========================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);


-- =========================================================
-- 4. DOCTORS
-- =========================================================

CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialisation VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctors_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);


-- =========================================================
-- 5. WARDS
-- =========================================================

CREATE TABLE wards (
    id BIGSERIAL PRIMARY KEY,
    hospital_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wards_hospital
        FOREIGN KEY (hospital_id)
        REFERENCES hospitals(id)
);


-- =========================================================
-- 6. BED TYPES
-- =========================================================

CREATE TABLE bed_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 7. PATIENTS
-- =========================================================

CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    gender gender_type NOT NULL,
    phone VARCHAR(20),
    patient_contact_no VARCHAR(20),
    emergency_contact_no VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 8. PRIORITY TYPES
-- =========================================================

CREATE TABLE priority_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 9. BEDS
-- =========================================================

CREATE TABLE beds (
    id BIGSERIAL PRIMARY KEY,
    ward_id BIGINT NOT NULL,
    bed_type_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    status bed_status NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_beds_ward
        FOREIGN KEY (ward_id)
        REFERENCES wards(id),

    CONSTRAINT fk_beds_bed_type
        FOREIGN KEY (bed_type_id)
        REFERENCES bed_types(id)
);


-- =========================================================
-- 10. ADMISSIONS
-- =========================================================

CREATE TABLE admissions (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    ward_id BIGINT NOT NULL,
    bed_id BIGINT NOT NULL,
    attending_doctor_id BIGINT NOT NULL,
    priority_id BIGINT NOT NULL,
    expected_stay_duration INT,
    diagnosis TEXT,
    status admission_status NOT NULL DEFAULT 'ACTIVE',
    admission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admissions_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    CONSTRAINT fk_admissions_ward
        FOREIGN KEY (ward_id)
        REFERENCES wards(id),

    CONSTRAINT fk_admissions_bed
        FOREIGN KEY (bed_id)
        REFERENCES beds(id),

    CONSTRAINT fk_admissions_doctor
        FOREIGN KEY (attending_doctor_id)
        REFERENCES doctors(id),

    CONSTRAINT fk_admissions_priority
        FOREIGN KEY (priority_id)
        REFERENCES priority_types(id)
);


-- =========================================================
-- 11. ADMISSION REQUESTS
-- =========================================================

CREATE TABLE admission_requests (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    ward_id BIGINT NOT NULL,
    bed_type_id BIGINT NOT NULL,
    priority_id BIGINT NOT NULL,
    expected_stay_duration INT,
    diagnosis TEXT,
    status admission_request_status NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requests_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    CONSTRAINT fk_requests_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id),

    CONSTRAINT fk_requests_ward
        FOREIGN KEY (ward_id)
        REFERENCES wards(id),

    CONSTRAINT fk_requests_bed_type
        FOREIGN KEY (bed_type_id)
        REFERENCES bed_types(id),

    CONSTRAINT fk_requests_priority
        FOREIGN KEY (priority_id)
        REFERENCES priority_types(id)
);


-- =========================================================
-- 12. ADMISSION TRANSFERS
-- =========================================================

CREATE TABLE admission_transfers (
    id BIGSERIAL PRIMARY KEY,
    admission_id BIGINT NOT NULL,
    from_ward_id BIGINT NOT NULL,
    from_bed_id BIGINT NOT NULL,
    to_ward_id BIGINT NOT NULL,
    to_bed_id BIGINT NOT NULL,
    reason TEXT,
    transferred_by BIGINT NOT NULL,
    transferred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transfers_admission
        FOREIGN KEY (admission_id)
        REFERENCES admissions(id),

    CONSTRAINT fk_transfers_from_ward
        FOREIGN KEY (from_ward_id)
        REFERENCES wards(id),

    CONSTRAINT fk_transfers_from_bed
        FOREIGN KEY (from_bed_id)
        REFERENCES beds(id),

    CONSTRAINT fk_transfers_to_ward
        FOREIGN KEY (to_ward_id)
        REFERENCES wards(id),

    CONSTRAINT fk_transfers_to_bed
        FOREIGN KEY (to_bed_id)
        REFERENCES beds(id),

    CONSTRAINT fk_transfers_user
        FOREIGN KEY (transferred_by)
        REFERENCES users(id)
);


-- =========================================================
-- 13. DISCHARGES
-- =========================================================

CREATE TABLE discharges (
    id BIGSERIAL PRIMARY KEY,
    admission_id BIGINT NOT NULL,
    discharged_by BIGINT NOT NULL,
    discharge_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_discharges_admission
        FOREIGN KEY (admission_id)
        REFERENCES admissions(id),

    CONSTRAINT fk_discharges_user
        FOREIGN KEY (discharged_by)
        REFERENCES users(id)
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_role_id
ON users(role_id);

CREATE INDEX idx_wards_hospital_id
ON wards(hospital_id);

CREATE INDEX idx_beds_ward_id
ON beds(ward_id);

CREATE INDEX idx_beds_bed_type_id
ON beds(bed_type_id);

CREATE INDEX idx_beds_status
ON beds(status);

CREATE INDEX idx_admission_requests_doctor_id
ON admission_requests(doctor_id);

CREATE INDEX idx_admission_requests_status
ON admission_requests(status);

CREATE INDEX idx_admissions_patient_id
ON admissions(patient_id);

CREATE INDEX idx_admissions_doctor_id
ON admissions(attending_doctor_id);

CREATE INDEX idx_admissions_bed_id
ON admissions(bed_id);

CREATE INDEX idx_transfers_admission_id
ON admission_transfers(admission_id);

CREATE INDEX idx_discharges_admission_id
ON discharges(admission_id);


-- =========================================================
-- 14. ADMISSION HISTORY (Unified Audit Log - Immutable)
-- =========================================================

CREATE TYPE admission_history_action AS ENUM (
    'ADMISSION_CREATED',
    'DOCTOR_APPROVED',
    'DOCTOR_REJECTED',
    'ADMITTED',
    'TRANSFERRED',
    'DISCHARGED'
);

CREATE TABLE admission_history (
    id                   BIGSERIAL PRIMARY KEY,
    admission_request_id BIGINT,
    admission_id         BIGINT,
    patient_id           BIGINT NOT NULL,
    action               admission_history_action NOT NULL,
    from_ward_id         BIGINT,
    from_bed_id          BIGINT,
    to_ward_id           BIGINT,
    to_bed_id            BIGINT,
    performed_by         BIGINT NOT NULL,
    reason               TEXT,
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id),

    CONSTRAINT fk_history_performed_by
        FOREIGN KEY (performed_by) REFERENCES users(id)
);

CREATE INDEX idx_history_patient_id ON admission_history(patient_id);
CREATE INDEX idx_history_admission_id ON admission_history(admission_id);
CREATE INDEX idx_history_admission_request_id ON admission_history(admission_request_id);