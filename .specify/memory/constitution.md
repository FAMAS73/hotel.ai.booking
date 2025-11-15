<!--
SYNC IMPACT REPORT - Constitution Update
Version: 1.0.0 → 1.0.0 (Initial Creation)
Ratification Date: 2025-01-15
Last Amended: 2025-01-15

CHANGES:
- Initial constitution created for Hotel AI Booking Chatbot thesis project
- Established core principles for AI chatbot development
- Defined thesis-specific constraints and workflow

PRINCIPLE MODIFICATIONS:
- None (initial creation)

SECTIONS ADDED:
- All sections created from template

SECTIONS REMOVED:
- None

TEMPLATES STATUS:
✅ .specify/templates/spec-template.md - Reviewed, compatible
✅ .specify/templates/plan-template.md - Reviewed, compatible
✅ .specify/templates/tasks-template.md - Reviewed, compatible

FOLLOW-UP ITEMS:
- None at this time
-->

# Hotel AI Booking Chatbot Constitution

## Core Principles

### I. Code-First Documentation

Every feature implementation MUST include inline code comments with clear explanations and examples. Comments MUST explain the "why" behind complex logic, not just the "what". Each function/method MUST have a docstring describing its purpose, parameters, return values, and usage examples where applicable.

**Rationale**: This is a thesis project requiring clear demonstration of understanding. Well-commented code serves dual purposes: documentation for academic review and maintainability for future development.

### II. Commit and Push to Main

All working changes MUST be committed and pushed directly to the main branch. No feature branches are required unless explicitly working on experimental features. Each commit message MUST clearly describe what was changed and why.

**Rationale**: Thesis development follows a linear progression model where each iteration builds on the previous. Direct main branch commits ensure the latest working version is always available for demonstration and review.

### III. No Unsolicited Documentation

Documentation files (README.md, design docs, user guides) MUST NOT be created unless explicitly requested by the user. All documentation MUST be embedded as code comments or maintained in existing project files.

**Rationale**: Thesis evaluation focuses on working code implementation and in-code documentation. External documentation creates maintenance overhead without adding academic value.

### IV. Security-First Implementation

All code MUST follow secure coding practices including parameterized SQL queries, password hashing, JWT authentication, and input validation. Security vulnerabilities (SQL injection, XSS, authentication bypass) MUST be identified and fixed immediately upon discovery.

**Rationale**: The hotel booking system handles sensitive guest data. Demonstrating security awareness is crucial for academic evaluation and reflects real-world professional standards.

### V. Incremental AI Conversion

When converting the NVIDIA blueprint to hotel domain, changes MUST be made systematically: data models first, then prompts, then tools, then integration tests. Each conversion phase MUST maintain system functionality.

**Rationale**: The thesis demonstrates domain adaptation of an existing AI blueprint. Systematic conversion ensures traceability of changes and minimizes breaking the working system.

### VI. Working Demonstrations Required

Every major feature MUST include a working demonstration script or test suite that can be executed to show functionality. Demo scripts MUST use realistic data and scenarios relevant to hotel booking operations.

**Rationale**: Thesis defense requires demonstrating working functionality. Executable demos provide concrete evidence of implementation success and facilitate academic presentation.

## Technical Standards

### Language and Framework Requirements

- **Primary Language**: Python 3.11+
- **AI Framework**: LangGraph for multi-agent orchestration
- **LLM Integration**: NVIDIA NIMs (meta/llama-3.3-70b-instruct)
- **Vector Database**: Milvus for RAG implementation
- **Relational Database**: PostgreSQL for booking data
- **API Framework**: FastAPI for REST endpoints
- **Authentication**: JWT with bcrypt password hashing

### Code Quality Standards

- All Python code MUST follow PEP 8 style guidelines
- Type hints MUST be used for function parameters and return values
- Error handling MUST use try-except blocks with specific exception types
- Logging MUST be implemented for all major operations (INFO level minimum)
- SQL queries MUST use parameterized statements (no string interpolation)

### Testing Requirements

- Critical features (authentication, booking operations, cancellations) MUST have test scripts
- Integration tests MUST validate end-to-end user journeys
- Security tests MUST verify SQL injection protection and authorization
- All tests MUST be executable via simple Python commands

### Data Standards

- Booking dates MUST use ISO 8601 format (YYYY-MM-DD)
- Timestamps MUST use ISO 8601 with timezone (YYYY-MM-DDTHH:MM:SS)
- Currency amounts MUST be stored as DECIMAL(10,2) in Thai Baht (THB)
- Guest IDs and Booking IDs MUST be INTEGER primary keys
- All CSV data files MUST include headers

## Thesis-Specific Constraints

### Academic Integrity

- All code modifications MUST maintain attribution to original NVIDIA blueprint
- Conversion changes MUST be documented in conversion summary files
- External libraries and frameworks MUST be properly cited
- Original Apache 2.0 license MUST be preserved

### Demonstration Readiness

- The system MUST be demonstrable within 5-10 minutes for thesis defense
- Demo account (<lightningboat24@gmail.com>) MUST always have working test data
- Swagger UI MUST be accessible for API demonstration
- Database MUST contain realistic sample data (50+ bookings)

### Scope Boundaries

- Implementation MUST focus on core hotel operations (booking, cancellation, room info, concierge)
- Advanced features (payment integration, multi-property, loyalty programs) are OPTIONAL
- Frontend development is MINIMAL (use provided UI or API testing only)
- Performance optimization is SECONDARY to functional correctness

## Development Workflow

### Change Management

1. Identify the specific feature or bug requiring changes
2. Update relevant code files with inline comments explaining changes
3. Test changes locally using demo scripts or manual testing
4. Commit with descriptive message: `[component]: what changed and why`
5. Push to main branch immediately after successful testing

### Git Commit Message Format

```text
[component]: Brief description of what changed

- Detailed explanation of changes
- Rationale for the approach taken
- Any side effects or dependencies updated

Example:
[agent/tools]: Fixed SQL injection in get_booking_history()

- Replaced f-string SQL with parameterized query
- Added input validation for guest_id parameter
- Ensures secure database queries per constitution principle IV
```

### Error Handling Protocol

1. Log the error with full stack trace at ERROR level
2. Return user-friendly error message via API (hide internal details)
3. Add inline comment explaining error scenario and handling approach
4. Update relevant test scripts to cover the error case
5. Commit fix with clear explanation

## Governance

### Amendment Procedure

This constitution may be amended when project requirements change significantly:

1. Document the proposed change and rationale
2. Update this constitution file with new/modified principles
3. Increment version number (MAJOR for principle changes, MINOR for clarifications)
4. Update `Last Amended` date
5. Propagate changes to dependent templates if needed
6. Commit with message: `docs: amend constitution to vX.Y.Z (change description)`

### Compliance Verification

All code commits MUST be verifiable against these principles:

- Review inline comments for clarity and completeness
- Verify no unsolicited documentation files created
- Check commit is pushed to main branch
- Validate security best practices followed
- Confirm thesis demonstration readiness maintained

### Versioning Policy

Constitution versions follow Semantic Versioning:

- **MAJOR** (X.0.0): Backward-incompatible principle changes or removals
- **MINOR** (0.X.0): New principles added or material expansions
- **PATCH** (0.0.X): Clarifications, wording fixes, non-semantic updates

### Principle Conflicts

If principles conflict in a specific scenario:

1. Security-First Implementation (Principle IV) takes precedence
2. Working Demonstrations Required (Principle VI) is second priority
3. Document the conflict scenario as inline comment
4. Choose the approach that best serves thesis demonstration

**Version**: 1.0.0 | **Ratified**: 2025-01-15 | **Last Amended**: 2025-01-15
