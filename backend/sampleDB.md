1) hospital
-> id, name, address, created_at, updated_at 

2) roles (master table)
=> id, name, is_active, created_at, updated_at 

3) users (docter / staff / ward manager)
=> id, name, role_id, email, password, is_active, created_at, updated_at 

4) doctors  (master table)
=> id, user_id, specialisation, created_at, updated_at 

4) ward (master table)
=> id, hospital_id, name, created_at, updated_at 

5) bed_type (master_table)
=> id, name, is_active, created_at, updated_at

6) bed (master_table)
=> id, ward_id, bed_type_id, name, status ( AVAILABLE, OCCUPIED, MAINTENANCE), occupied_by_admission_id, is_active, created_at, updated_at 

7) patient
=> id, name, age, gender (M/F), phone, patient_contact_no, emergency_contact_no,created_at, updated_at 

7) priority_type (master table)
=> id, name (Routine, Urgent, Critical), is_active, created_at, updated_at 

8) admission_requests
=> id, admission_id, doctor_id, status, reason, requested_at, responded_at, created_at, updated_at

request_status
ENUM(
  PENDING
  APPROVED -> Waiting-list-logs
  BED_ASSIGNED
  REJECTED
  CANCELLED
)

9) admission (after approvals and bed asignment and updated bed-movements)
=> id, patient_id, ward_id, bed_type_id, attending_doctor_id, priority_id, expected_stay_duration, diagnosis, request_status,  admission_date, discharge_date, created_at, updated_at

10) admission_transfers
=> id, admission_id, from_ward_id, from_bed_id, to_ward_id, to_bed_id, reason, transferred_by, transferred_at, created_at, updated_at

11) discharges
=> id, admission_id, discharged_by, discharge_date, created_at, updated_at

