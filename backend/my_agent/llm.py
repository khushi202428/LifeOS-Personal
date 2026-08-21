from my_agent.schemas.intentresolutionoutput import IntentResolutionOutput
from my_agent.schemas.goalcreate import GoalCreate
from my_agent.schemas.evalaution_schema import EvaluatorOutput
from my_agent.schemas.routine import RoutineLLMOutput
from my_agent.schemas.diet import DietPlan
from my_agent.schemas.fitness import FitnessPlan
from my_agent.schemas.activity import ActivityCreateList
from my_agent.schemas.analytics import AggregationOutput
from langchain_groq import ChatGroq
from my_agent.schemas.fitness import WeeklyFitnessRoutine
from langchain_core.tools import tool
from dotenv import load_dotenv
from my_agent.schemas.fitness import WeeklyFocus
from my_agent.schemas.fitness import (
    StrengthDetails,
    CardioDetails,
    MobilityDetails,
)
from my_agent.schemas.routine_structure import RoutineStructurerNodeResponse, PlanningDeciderOutput
from my_agent.schemas.fitness import DayTimelineSkeleton
from my_agent.tools.date_tools import (
    get_today_date,
    add_days_to_date
)

import os

load_dotenv()

# --------------------------------------------------
# GLOBAL API KEY (IMPORTANT)
# --------------------------------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_llm(model="openai/gpt-oss-120b", temperature=0.7):
    return ChatGroq(
        model=model,
        temperature=temperature,
        api_key=GROQ_API_KEY
    )

# --------------------------------------------------
# Tools
# --------------------------------------------------
tools_date = [
    get_today_date,
    add_days_to_date
]

@tool
def json(**kwargs):
    """Transport-only tool for structured outputs."""
    return kwargs

# --------------------------------------------------
# Base LLMs
# --------------------------------------------------
base_llm = get_llm("openai/gpt-oss-120b", 0.7)

plan_mode = get_llm("openai/gpt-oss-120b", 0.3)\
    .bind_tools(tools_date)\
    .with_structured_output(PlanningDeciderOutput)

aggregation_llm = get_llm("openai/gpt-oss-120b", 0.1)
analysis_llm = get_llm("openai/gpt-oss-120b", 0.5)

# JSON-schema structured output is used below. GPT-OSS supports Groq's
# structured-output API; the previous Llama model was configured for tool calls.
goal_prompt_llm = get_llm("openai/gpt-oss-120b", 0.1)

evaluator_llm = get_llm("openai/gpt-oss-120b", 0.3)
routine_llm = get_llm("openai/gpt-oss-120b", 0.3)
fitness_planner_llm = get_llm("openai/gpt-oss-120b", 0.3)

# --------------------------------------------------
# Structured Outputs
# --------------------------------------------------
goal_prompt_structured_llm = (
    goal_prompt_llm
    .with_structured_output(GoalCreate, method="json_schema")
)

intent_resolver_llm = (
    base_llm
    .with_structured_output(IntentResolutionOutput, method="json_schema")
)

evaluator_structured_llm = (
    evaluator_llm
    .with_structured_output(EvaluatorOutput, method="json_schema")
)

routine_structured_llm = (
    routine_llm
    # GPT-OSS occasionally returns the JSON *schema* itself when invoked
    # through Groq's json_schema mode.  Function calling returns the actual
    # arguments and is parsed by LangChain into RoutineLLMOutput.
    .with_structured_output(RoutineLLMOutput, method="function_calling")
)

diet_planer_llm = (
    routine_llm
    .with_structured_output(DietPlan, method="json_schema")
)

structured_fitness_planer_llm = (
    fitness_planner_llm
    .with_structured_output(FitnessPlan, method="json_schema")
)

weekly_focus_llm = (
    get_llm("openai/gpt-oss-120b", 0.1)
    .with_structured_output(WeeklyFocus, method="json_schema")
)

day_timeline_llm = (
    get_llm("openai/gpt-oss-120b", 0.2)
    .with_structured_output(DayTimelineSkeleton, method="json_schema")
)

strength_detail_llm = (
    get_llm("openai/gpt-oss-120b", 0.2)
    .with_structured_output(StrengthDetails, method="json_schema")
)

cardio_detail_llm = (
    get_llm("openai/gpt-oss-120b", 0.2)
    .with_structured_output(CardioDetails, method="json_schema")
)

mobility_detail_llm = (
    get_llm("openai/gpt-oss-120b", 0.2)
    .with_structured_output(MobilityDetails, method="json_schema")
)

activity_structured_llm = (
    base_llm
    .with_structured_output(ActivityCreateList, method="json_schema")
)

analytics_structured_llm = (
    aggregation_llm
    .with_structured_output(AggregationOutput, method="json_schema")
)

routine_structurer_llm = (
    analysis_llm
    .with_structured_output(RoutineStructurerNodeResponse, method="json_schema")
)
