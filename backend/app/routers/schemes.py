
from fastapi import APIRouter, HTTPException, Query
from app.services.knowledge_base import load_schemes

router = APIRouter(
    prefix="/api/schemes",
    tags=["Government Schemes"]
)


def matches_search(scheme: dict, search: str) -> bool:
    """Search scheme information using a case-insensitive query."""

    if not search:
        return True

    searchable_fields = [
        scheme.get("name", ""),
        scheme.get("category", ""),
        scheme.get("description", ""),
        scheme.get("benefit", ""),
        scheme.get("details", ""),
        scheme.get("location", ""),
        " ".join(scheme.get("benefits") or []),
        " ".join(scheme.get("eligibility") or []),
        " ".join(scheme.get("documents") or [])
    ]

    searchable_text = " ".join(
        str(field) for field in searchable_fields
    ).lower()

    return search.lower() in searchable_text


@router.get("/")
def get_schemes(
    search: str = Query(default="", description="Search by scheme name, category or benefit"),
    category: str = Query(default="All", description="Filter by scheme category")
):
    """Get all schemes or filter them by search and category."""

    try:
        schemes = load_schemes()

        if not schemes:
            return {
                "success": True,
                "total": 0,
                "schemes": [],
                "message": "No scheme records found in the knowledge base."
            }

        filtered_schemes = []

        for scheme in schemes:
            matches_category = (
                category.strip().lower() == "all"
                or scheme.get("category", "").lower() == category.strip().lower()
            )

            matches_query = matches_search(scheme, search.strip())

            if matches_category and matches_query:
                filtered_schemes.append(scheme)

        return {
            "success": True,
            "total": len(filtered_schemes),
            "schemes": filtered_schemes
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to retrieve schemes: {str(error)}"
        )


@router.get("/{scheme_id}")
def get_scheme_by_id(scheme_id: str):
    """Get details of one scheme using its ID."""

    try:
        schemes = load_schemes()

        for scheme in schemes:
            if str(scheme.get("id")) == scheme_id:
                return {
                    "success": True,
                    "scheme": scheme
                }

        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to retrieve scheme: {str(error)}"
        )
