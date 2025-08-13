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

export const auditStateMap = {
  [AuditState.Unaudited]: "未审核",
  [AuditState.Auditing]: "审核中",
  [AuditState.Passed]: "已通过",
  [AuditState.Failed]: "未通过",
};

export const auditStateColorMap = {
  [AuditState.Unaudited]: 'gray',
  [AuditState.Auditing]: 'blue',
  [AuditState.Passed]: "green",
  [AuditState.Failed]: "red",
};

export const publishStateMap = {
  [PublishState.Unpublished]: "未发布",
  [PublishState.Publishing]: "待发布",
  [PublishState.Published]: "已发布",
  [PublishState.Withdrawed]: "已下线",
};

export const publishStateColorMap = {
  [PublishState.Unpublished]: "gray",
  [PublishState.Publishing]: "blue",
  [PublishState.Published]: "green",
  [PublishState.Withdrawed]: "red",
};