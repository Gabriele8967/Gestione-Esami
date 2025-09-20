
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class PatientCategory(str, enum.Enum):
    LOW_RESP = "LOW_RESP"
    HIGH_RESP = "HIGH_RESP"
    DATA_DA_DEFINIRE = "DATA_DA_DEFINIRE"
    PMA_FATTE_2024 = "PMA_FATTE_2024"

class ExamGender(str, enum.Enum):
    UOMO = "Uomo"
    DONNA = "Donna"

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(Enum(PatientCategory))

    exams = relationship("PatientExam", back_populates="patient")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    gender = Column(Enum(ExamGender))
    category = Column(String)
    validity_months = Column(Integer)

class PatientExam(Base):
    __tablename__ = "patient_exams"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    exam_date = Column(Date)

    patient = relationship("Patient", back_populates="exams")
    exam = relationship("Exam")
