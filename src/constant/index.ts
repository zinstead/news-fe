export enum RoleType {
  SuperAdmin = 1,
  Admin = 2,
  Editor = 3
}

export enum AuditState{
  Unaudited=0,
  Auditing=1,
  Passed=2,
  Failed=3
}

export enum PublishState{
  Unpublished=0,
  Publishing=1,
  Published=2,
  Withdrawed=3
}