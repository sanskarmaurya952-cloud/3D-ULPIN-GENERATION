from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.models.schemas import OfficerDecisionRequest
from backend.app.services.topology_engine import TopologyEngineService
from backend.app.database.storage import store

router = APIRouter(prefix="/validation", tags=["Validation"])

@router.post("/run")
def run_validation():
    return TopologyEngineService.run_full_validation()

@router.get("/issues", response_model=List[Dict[str, Any]])
def get_validation_issues():
    return store.get_all_validation_issues()

@router.get("/issues/{issue_id}")
def get_validation_issue(issue_id: str):
    issue = store.get_validation_issue_by_id(issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail=f"Validation issue '{issue_id}' not found.")
    return issue

@router.post("/{issue_id}/decision")
def post_officer_decision(issue_id: str, req: OfficerDecisionRequest):
    updated = store.set_officer_decision(
        issue_id=issue_id,
        decision=req.decision,
        officer_name=req.officer_name,
        comments=req.comments
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Validation issue '{issue_id}' not found.")
    return {
        "message": f"Officer decision '{req.decision}' successfully registered.",
        "issue": updated
    }
