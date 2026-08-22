from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.models.weekly_fitness_routine import WeeklyFitnessRoutineDB, RoutineStatus
from app.models.fitness_routine_progress import FitnessRoutineProgressDB
from app.models.goal import Goal
from app.schemas.weekly_fitness_routine import WeeklyFitnessRoutineResponse, FitnessProgressUpdate

router = APIRouter(tags=["Fitness"])

def get_or_create_progress(db: Session, routine: WeeklyFitnessRoutineDB):
    progress = db.query(FitnessRoutineProgressDB).filter_by(routine_id=routine.routine_id).first()
    if progress:
        return progress
    goal = Goal(
        user_id=routine.user_id,
        goal_name=f"Complete {routine.routine_name}",
        description="Complete the exercises in your approved weekly fitness routine.",
        importance_level=3,
        percent_completion=0.0,
    )
    db.add(goal)
    db.flush()
    progress = FitnessRoutineProgressDB(routine_id=routine.routine_id, user_id=routine.user_id, goal_id=goal.goal_id, completed_blocks={})
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress

def response_for(db: Session, routine: WeeklyFitnessRoutineDB):
    progress = get_or_create_progress(db, routine)
    total = sum(len(day.get("timeline", {})) for day in routine.schedule.values())
    completed = sum(1 for value in (progress.completed_blocks or {}).values() if value)
    percent = round((completed / total) * 100, 2) if total else 0.0
    goal = db.get(Goal, progress.goal_id)
    if goal and goal.percent_completion != percent:
        goal.percent_completion = percent
        db.commit()
    return {**{column: getattr(routine, column) for column in ("routine_id", "user_id", "routine_name", "plan_snapshot", "schedule", "status", "created_at")}, "goal_id": progress.goal_id, "progress_percent": percent, "completed_blocks": progress.completed_blocks or {}}
@router.get("/weekly-routine", response_model=WeeklyFitnessRoutineResponse)
def get_weekly_fitness_routine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.user_id
    print(user_id)
    
    """
    Fetch user's weekly fitness routine.

    Priority:
    1️⃣ Approved routine
    2️⃣ Latest draft (fallback)
    """

    # 1️⃣ Try approved routine first
    routine = (
        db.query(WeeklyFitnessRoutineDB)
        .filter(
            WeeklyFitnessRoutineDB.user_id == user_id,
            WeeklyFitnessRoutineDB.status == RoutineStatus.approved,
        )
        .order_by(WeeklyFitnessRoutineDB.created_at.desc())
        .first()
    )

    # 2️⃣ Fallback to latest draft
    if not routine:
        routine = (
            db.query(WeeklyFitnessRoutineDB)
            .filter(WeeklyFitnessRoutineDB.user_id == user_id)
            .order_by(WeeklyFitnessRoutineDB.created_at.desc())
            .first()
        )

    if not routine:
        raise HTTPException(
            status_code=404,
            detail="No weekly fitness routine found",
        )

    return response_for(db, routine)

@router.patch("/weekly-routine/progress", response_model=WeeklyFitnessRoutineResponse)
def update_fitness_progress(payload: FitnessProgressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    routine = db.query(WeeklyFitnessRoutineDB).filter(WeeklyFitnessRoutineDB.user_id == current_user.user_id).order_by(WeeklyFitnessRoutineDB.created_at.desc()).first()
    if not routine:
        raise HTTPException(status_code=404, detail="No weekly fitness routine found")
    if payload.day not in routine.schedule or payload.time_range not in routine.schedule[payload.day].get("timeline", {}):
        raise HTTPException(status_code=400, detail="Workout block not found")
    progress = get_or_create_progress(db, routine)
    completed_blocks = dict(progress.completed_blocks or {})
    completed_blocks[f"{payload.day}|{payload.time_range}"] = payload.completed
    progress.completed_blocks = completed_blocks
    db.commit()
    return response_for(db, routine)
