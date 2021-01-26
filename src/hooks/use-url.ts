import React from 'react';
import type {InputProps} from 'antd/lib/input';

export function useUrl(
  initialValue: string = '',
): [string, InputProps['onChange']] {
  const [url, setURL] = React.useState<string>(initialValue);

  const handleChangeURL: InputProps['onChange'] = React.useCallback((event) => {
    setURL(event.target.value);
  }, []);

  return [url, handleChangeURL];
}
