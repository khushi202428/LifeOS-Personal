from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
from sqlalchemy import Integer, Column
from enum import Enum


class RoutineStatus(str, Enum):
    draft = "draft"
    approved = "approved"


class WeeklyFitnessRoutineResponse(BaseModel):
    routine_id: str
    user_id : int
    routine_name: str

    # 🔥 EXACT LLM OUTPUT — DO NOT TRANSFORM
    plan_snapshot: Dict[str, Any]
    schedule: Dict[str, Any]

    status: RoutineStatus
    created_at: datetime
    goal_id: int
    progress_percent: float
    completed_blocks: Dict[str, bool]

    class Config:
        orm_mode = True


class FitnessProgressUpdate(BaseModel):
    day: str
    time_range: str
    completed: bool
