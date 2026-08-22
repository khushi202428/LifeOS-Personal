from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from app.core.database import Base


class FitnessRoutineProgressDB(Base):
    __tablename__ = "fitness_routine_progress"

    routine_id = Column(String, ForeignKey("weekly_fitness_routines.routine_id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    goal_id = Column(Integer, ForeignKey("goals.goal_id", ondelete="CASCADE"), nullable=False)
    completed_blocks = Column(JSON, nullable=False, default=dict)
