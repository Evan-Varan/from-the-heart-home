# Spec 10: File Uploads With R2

## Product Context

Families and tutors should be able to upload files such as homework, syllabi, test reviews, essays, screenshots, and other tutoring materials. Files should be stored cheaply and securely with Cloudflare R2.

## Goal

Implement secure file upload, storage, listing, download, and deletion/archive behavior using Cloudflare R2.

## Pre-Spec Checklist

- Confirm Specs 01-03 are complete enough for permissioned file pages.
- Review [Manual Actions Checklist](./manual-actions.md), especially R2 buckets and protected-download gate.
- Confirm file size limit and allowed file types.
- Confirm R2 bucket binding names for local/dev/prod.

## Manual Actions

- `ACCOUNT REQUIRED`: Create Cloudflare R2 buckets for dev/staging and production or approve the implementer to create them.
- `OWNER REQUIRED`: Confirm initial file size limit. Recommended default is 20 MB per file.
- `OWNER REQUIRED`: Confirm allowed file types.
- `PRODUCTION GATE`: Verify protected files cannot be downloaded publicly.

## Post-Spec Checklist

- Run `npm run build`.
- Run targeted lint on changed file/R2 modules.
- Verify upload writes metadata and R2 object.
- Verify invalid file type/size is rejected server-side.
- Verify authorized users can download files.
- Verify unauthorized users cannot download files by guessing IDs or URLs.
- Confirm Spec 11 can show file-related dashboard links if needed.

## Dependencies

- Spec 01: Auth, Roles, And Permissions
- Spec 02: Database Schema
- Spec 03: Portal UI Shell And Design System

## User Stories

- As a family, I can upload a file for a student.
- As a tutor, I can view files for students I tutor.
- As a tutor, I can upload files relevant to a student/session.
- As an admin, I can view all files.
- As a user, I can download files I am allowed to access.

## File Types

Support common school/tutoring files:

- PDF
- Images
- Word documents
- Plain text
- Common spreadsheet formats if needed

Set reasonable file size limits. Start with a simple limit such as 20 MB per file unless product needs require more.

## Storage Model

Use Cloudflare R2 for binary files and D1 `files` table for metadata.

R2 key format should avoid exposing original user data directly:

```text
portal/{env}/families/{familyAccountId}/students/{studentId}/{fileId}-{safeFilename}
```

Do not rely on public R2 URLs for protected files. Use signed URLs or server-mediated download authorization.

## Routes

Family:

- `/portal/files`
- `/portal/students/:studentId`
- `/portal/sessions/:sessionId`

Tutor:

- `/portal/tutor/students/:studentId`
- `/portal/tutor/sessions/:sessionId`

Admin:

- `/portal/admin/files`
- `/portal/admin/students/:studentId`

## UI Requirements

### Upload Area

Provide:

- Drag/drop or standard file input
- Student selector if context is not already known
- Optional session association
- Upload progress if practical
- Clear errors for invalid file type/size

### File List

Show:

- Filename
- Uploaded by
- Student/session context
- File type
- Size
- Uploaded date
- Download action
- Delete/archive action where allowed

## Backend Requirements

- Validate file size and content type server-side.
- Create file metadata record.
- Upload binary to R2.
- Generate authorized download links.
- Enforce permission checks before upload/download.
- Audit upload and delete/archive actions.
- Avoid overwriting files with same filename.

## Permissions

- Families can upload and view files for their own students.
- Tutors can upload and view files for students/sessions connected to them.
- Admins can view all files.
- Families and tutors can archive/delete their own uploaded files if no business rule blocks it.
- Admins can archive/delete any file.

## Edge Cases

- Upload succeeds to R2 but metadata write fails.
- Metadata write succeeds but upload fails.
- User tries to access a file from another family.
- File name contains unsafe characters.
- File is too large.
- Unsupported content type.

## Acceptance Criteria

- Files upload to R2.
- File metadata is stored in D1.
- Users can list files they are allowed to see.
- Downloads require authorization.
- Unauthorized file access is blocked.
- File size/type validation works.

## Out Of Scope

- Message attachments
- File previews/annotations
- Virus scanning unless added later
- OCR/search over files
- Public file sharing links
