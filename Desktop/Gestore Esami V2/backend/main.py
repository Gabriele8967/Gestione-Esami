
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import crud
import models
import schemas
from database import SessionLocal, engine

# This line creates the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gestore Esami API",
    description="API per la gestione degli esami dei pazienti.",
    version="0.1.0",
)

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://172.20.83.73:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Benvenuto nella API del Gestore Esami"}

@app.get("/api/patients/", response_model=List[schemas.Patient], tags=["Patients"])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = crud.get_patients(db, skip=skip, limit=limit)
    return patients

@app.get("/api/patients/{patient_id}", response_model=schemas.Patient, tags=["Patients"])
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@app.get("/api/exams/", response_model=List[schemas.Exam], tags=["Exams"])
def read_exams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    exams = crud.get_exams(db, skip=skip, limit=limit)
    return exams

@app.post("/api/patients/{patient_id}/exams/", response_model=schemas.PatientExam, tags=["Patients"])
def create_patient_exam(
    patient_id: int,
    patient_exam: schemas.PatientExamCreate,
    db: Session = Depends(get_db)
):
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return crud.create_patient_exam(db=db, patient_id=patient_id, exam_id=patient_exam.exam_id, exam_date=patient_exam.exam_date)
