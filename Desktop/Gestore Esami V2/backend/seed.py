
import csv
from database import SessionLocal, engine
from models import Patient, Exam, PatientExam, Base, PatientCategory, ExamGender

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Clear existing data
    db.query(PatientExam).delete()
    db.query(Exam).delete()
    db.query(Patient).delete()
    db.commit()

    # --- Exams Data ---
    exams_data = {
        "Donna": {
            "Esami infettivologici": (
                3, # validity
                ["HIV Ab", "HCV Ab", "HBsAg", "HBcAb IgG", "HBcAb IgM", "CMV IgM", "CMV IgG", "VDRL", "TPHA", "Toxoplasma IgM", "Toxoplasma IgG", "Rubeo IgM", "Rubeo IgG"]
            ),
            "Esami pick up": (
                6,
                ["Emocromo con formula", "Azotemia", "Glicemia", "Transaminasi ALT e AST", "Bilirubinemia", "PT e PTT", "Fibrinogeno", "Test di Coombs indiretto", "Elettrocardiogramma"]
            ),
            "Esami TESE – recupero chirurgico gameti": (
                6,
                ["Emocromo con formula", "Azotemia", "Glicemia", "Transaminasi ALT e AST", "Bilirubinemia", "Protidogramma", "PT e PTT", "Fibrinogeno", "Elettrocardiogramma"]
            ),
            "Esami genetici": (
                None, # No validity specified
                ["Cariotipo", "Fibrosi cistica", "Elettroforesi Hb", "Emogruppo", "Glucosio-6P Deidrogenasi"]
            ),
            "Esami facoltativi": (
                None,
                ["Tampone vaginale per germi comuni", "Tampone cervicale per Mycoplasma e Ureaplasma", "Tampone Chlamydia PCR", "Pannello trombofilia (Fatt. II, Fatt. V, PAI)", "Proteina C, S e Proteina C attivata", "Omocisteina", "<40 anni: Eco mammaria", ">40 anni: Mammografia"]
            )
        },
        "Uomo": {
            "Esami infettivologici": (
                3,
                ["HIV Ab", "HCV Ab", "HBsAg", "HBcAb IgG", "HBcAb IgM", "CMV IgM", "CMV IgG", "VDRL", "TPHA"]
            ),
            "Esami genetici": (
                None,
                ["Cariotipo", "Fibrosi cistica", "Elettroforesi Hb", "Glucosio-6P Deidrogenasi"]
            )
        }
    }

    for gender, categories in exams_data.items():
        for category, (validity, names) in categories.items():
            for name in names:
                exam = Exam(
                    name=name,
                    gender=ExamGender.DONNA if gender == "Donna" else ExamGender.UOMO,
                    category=category,
                    validity_months=validity
                )
                db.add(exam)
    db.commit()
    print("Seeded exams table.")

    # --- Patients Data ---
    csv_files = {
        "../PROGRAMMA  - HIGH RESP.csv": PatientCategory.HIGH_RESP,
        "../PROGRAMMA  - LOW RESP.csv": PatientCategory.LOW_RESP,
        "../PROGRAMMA  - Data da definire.csv": PatientCategory.DATA_DA_DEFINIRE,
        "../PROGRAMMA  - PMA fatte 2024.csv": PatientCategory.PMA_FATTE_2024,
    }

    for file_path, category in csv_files.items():
        try:
            with open(file_path, mode='r', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                # Skip header if necessary - crude check
                first_row = next(reader)
                if 'PAZIENTE' in first_row[0]:
                    pass # It's a header
                else:
                    # Process it as a data row
                    patient_name = first_row[0].strip()
                    if patient_name:
                        patient = Patient(name=patient_name, category=category)
                        db.add(patient)

                # Process remaining rows
                for row in reader:
                    if not row: continue
                    patient_name = row[0].strip()
                    if patient_name:
                        patient = Patient(name=patient_name, category=category)
                        db.add(patient)
            db.commit()
            print(f"Seeded patients from {file_path}.")
        except FileNotFoundError:
            print(f"Warning: {file_path} not found. Skipping.")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            db.rollback()

    db.close()
    print("Database seeding complete.")

if __name__ == "__main__":
    seed_database()
