import { CodeSnippet } from '../../get-started/components/CodeSnippet';
import { Loader, Timeline as MantineTimeline } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { IconCheck } from '@novu/novui/icons';
import { useQuery } from '@tanstack/react-query';
import { getApiKeys } from '../../../api/environment';
import { Text } from '@novu/novui';
import { Timeline } from '../../../components/Timeline/index';
import { css } from '@novu/novui/css';
import { BridgeStatus } from '../../../bridgeApi/bridgeApi.client';
import { useColorScheme } from '@novu/design-system';

const Icon = () => (
  <IconCheck
    className={css({
      color: 'typography.text.main !important',
    })}
  />
);

export const SetupTimeline = ({ testResponse }: { testResponse: { isLoading: boolean; data: BridgeStatus } }) => {
  const { data: apiKeys = [] } = useQuery<{ key: string }[]>(['getApiKeys'], getApiKeys);
  const key = useMemo(() => apiKeys[0]?.key, [apiKeys]);
  const [active, setActive] = useState(0);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (testResponse?.isLoading || testResponse?.data?.status !== 'ok') {
      return;
    }
    setActive(3);
  }, [testResponse?.data?.status, testResponse?.isLoading]);

  function CheckStatusIcon() {
    return (
      <>
        {testResponse?.isLoading || testResponse?.data?.status !== 'ok' ? (
          <Loader size={16} color={colorScheme === 'dark' ? 'white' : 'dark'} />
        ) : (
          <Icon />
        )}
      </>
    );
  }

  return (
    <Timeline>
      <MantineTimeline.Item
        bullet={active >= 1 ? <Icon /> : 1}
        lineVariant="dashed"
        title="Create Novu Example App"
        active={active >= 1}
      >
        <Text variant="main" color="typography.text.secondary">
          This will create a new Next.js sample app with React-Email
        </Text>
        <CodeSnippet
          command={`npx create-novu-app --api-key=${key}`}
          onClick={() => {
            setActive((old) => (old > 1 ? old : 1));
          }}
        />
      </MantineTimeline.Item>
      <MantineTimeline.Item
        bullet={active >= 2 ? <Icon /> : 2}
        lineVariant="dashed"
        title="Start your application"
        active={active >= 2}
      >
        <CodeSnippet
          command={'cd my-novu-app && npm run dev'}
          onClick={() => {
            setActive((old) => (old > 2 ? old : 2));
          }}
        />
      </MantineTimeline.Item>
      <MantineTimeline.Item
        bullet={<CheckStatusIcon />}
        lineVariant="dashed"
        title="Connect to the Novu Bridge Endpoint"
        active={active >= 3}
      >
        <Text variant="main" color="typography.text.secondary">
          {active < 3 ? 'Waiting for you to start the application' : 'Succefully connected to the Novu Bridge Endpoint'}
        </Text>
      </MantineTimeline.Item>
    </Timeline>
  );
};
