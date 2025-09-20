
from pydantic import BaseModel
from datetime import date
from models import PatientCategory, ExamGender

class PatientExamBase(BaseModel):
    exam_id: int
    exam_date: date

class PatientExamCreate(PatientExamBase):
    pass

class PatientExam(PatientExamBase):
    id: int
    patient_id: int

    class Config:
        orm_mode = True

class PatientBase(BaseModel):
    name: str
    category: PatientCategory

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    exams: list[PatientExam] = []

    class Config:
        orm_mode = True

class ExamBase(BaseModel):
    name: str
    gender: ExamGender
    category: str
    validity_months: int | None

class Exam(ExamBase):
    id: int

    class Config:
        orm_mode = True
