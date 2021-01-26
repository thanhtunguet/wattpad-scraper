import React, {Reducer} from 'react';
import {LogAction, LogActionType, logReducer} from 'src/reducers/log-reducer';

export function useMultilineString(): [
  string[],
  () => void,
  (line: string) => void,
] {
  const [logs, dispatch] = React.useReducer<Reducer<string[], LogAction>>(
    logReducer,
    [],
  );

  const handleResetLog = React.useCallback(() => {
    dispatch({
      type: LogActionType.reset,
    });
  }, []);

  const handleAppendLog = React.useCallback((line: string) => {
    dispatch({
      type: LogActionType.append,
      line,
    });
  }, []);

  return [logs, handleResetLog, handleAppendLog];
}
