
import traceback
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.agents.eligibility_agent import check_eligibility

router = APIRouter(
    prefix="/api/eligibility",
    tags=["Eligibility Agent"]
)


class EligibilityRequest(BaseModel):
    age: int = Field(..., ge=0, le=120)
    state: str
    occupation: str
    annual_income: float = Field(..., ge=0)
    category: str

    owns_cultivable_land: Optional[bool] = None
    institutional_landholder: Optional[bool] = None
    constitutional_post_holder: Optional[bool] = None
    elected_representative: Optional[bool] = None
    government_employee: Optional[bool] = None
    government_employee_exempt_category: Optional[bool] = None
    monthly_pension_10000_or_more: Optional[bool] = None
    income_taxpayer: Optional[bool] = None
    registered_professional_practicing: Optional[bool] = None
    land_acquired_after_cutoff: Optional[bool] = None


@router.post("/check")
def eligibility_check(request: EligibilityRequest):
    try:
        return check_eligibility(
            **request.model_dump()
        )

    except Exception:
        print("\n========== ELIGIBILITY AGENT ERROR ==========")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Unable to process eligibility assessment."
        )
