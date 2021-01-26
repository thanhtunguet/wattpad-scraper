import React, {ReactElement} from 'react';
import ReactDOM from 'react-dom';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import {useUrl} from 'src/hooks/use-url';
import {
  Controlled as CodeMirror,
  IControlledCodeMirror,
} from 'react-codemirror2';
import {logOptions} from 'src/config/codemirror';
import 'src/styles/styles.scss';
import {ipcRenderer} from 'electron';
import {ScraperEvent} from 'src/config/scraper-event';
import {useMultilineString} from 'src/hooks/use-multiline-string';
import message from 'antd/lib/message';
import {getStoryFilename} from 'src/helpers/get-story-filename';

const {Item: FormItem} = Form;

const onBeforeChange: IControlledCodeMirror['onBeforeChange'] = () => {};

function App(): ReactElement {
  const [loading, setLoading] = React.useState<boolean>(false);

  const [url, handleChangeURL] = useUrl();

  const [logs, handleResetLog, handleAppendLog] = useMultilineString();

  const [result, handleResetResult, handleAppendResult] = useMultilineString();

  React.useEffect(() => {
    ipcRenderer.on(
      ScraperEvent.SCRAPING_NEW_CONTENT,
      (event, content: string) => {
        handleAppendResult(content);
      },
    );

    ipcRenderer.on(ScraperEvent.LOG, (event, content: string) => {
      handleAppendLog(content);
    });

    ipcRenderer.on(ScraperEvent.SCRAPING_FINISHED, () => {
      setLoading(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(ScraperEvent.SCRAPING_NEW_CONTENT);
      ipcRenderer.removeAllListeners(ScraperEvent.SCRAPING_FINISHED);
    };
  }, [handleAppendLog, handleAppendResult]);

  const handleSubmit = React.useCallback(() => {
    setLoading(true);
    handleResetLog();
    handleResetResult();
    handleAppendLog('Start scraping');
    ipcRenderer.send(ScraperEvent.SCRAPE, url);
  }, [handleAppendLog, handleResetResult, handleResetLog, url]);

  const handleDownload = React.useCallback(() => {
    if (loading) {
      message.error('Please wait until the scraping process done');
      return;
    }
    if (result.length === 0) {
      message.error('File empty');
      return;
    }
    const uInt8 = new Blob(result, {
      type: 'text/plain; charset=UTF-8',
    });
    const fileUrl = window.URL.createObjectURL(uInt8);
    const anchor: HTMLAnchorElement = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = getStoryFilename(url);
    anchor.click();
    window.URL.revokeObjectURL(fileUrl);
  }, [loading, result, url]);

  return (
    <div className="container py-4">
      <Typography.Title>Wattpad scraper</Typography.Title>
      <Spin spinning={loading} tip="Scraping">
        <Form>
          <FormItem label="Story URL">
            <Input
              disabled={loading}
              value={url}
              onChange={handleChangeURL}
              placeholder="https://www.wattpad.com/xxxxxxxxx-story-title"
            />
          </FormItem>
          <div className="d-flex justify-content-between">
            <Button
              type="primary"
              htmlType="button"
              onClick={handleSubmit}
              disabled={loading}
              loading={loading}>
              Submit
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={handleDownload}
              disabled={result.length === 0}
              loading={loading}>
              Download
            </Button>
          </div>
        </Form>
      </Spin>
      <div className="my-2">
        <CodeMirror
          options={logOptions}
          onBeforeChange={onBeforeChange}
          value={React.useMemo(() => logs.join('\n'), [logs])}
        />
      </div>
    </div>
  );
}

ReactDOM.render(
  <>
    <App />
  </>,
  document.getElementById('root'),
);
