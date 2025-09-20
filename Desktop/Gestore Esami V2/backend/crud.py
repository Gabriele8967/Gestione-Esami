
from sqlalchemy.orm import Session
from datetime import date
import models
import schemas

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def get_patient(db: Session, patient_id: int):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Exam).offset(skip).limit(limit).all()

def create_patient_exam(db: Session, patient_id: int, exam_id: int, exam_date: date):
    db_patient_exam = models.PatientExam(patient_id=patient_id, exam_id=exam_id, exam_date=exam_date)
    db.add(db_patient_exam)
    db.commit()
    db.refresh(db_patient_exam)
    return db_patient_exam
