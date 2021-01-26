export enum LogActionType {
  reset,
  append,
  write,
}

export interface LogAction {
  type: LogActionType;

  line?: string;

  logs?: string[];
}

export function logReducer(state: string[], action: LogAction): string[] {
  switch (action.type) {
    case LogActionType.reset:
      return [];

    case LogActionType.append:
      return [...state, action.line];

    case LogActionType.write:
      return action.logs;

    default:
      return state;
  }
}
