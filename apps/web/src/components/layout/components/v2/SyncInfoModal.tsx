// TODO: replace with Novui Code Block when available
import { Prism } from '@mantine/prism';
// TODO: replace with Novui Modal when available
import { Modal } from '@novu/design-system';
import { Tabs, Text, Title } from '@novu/novui';
import { FC } from 'react';
import { useApiKeysPage } from '../../../../pages/settings/ApiKeysPage/useApiKeysPage';
import { useBridgeURL } from '../../../../studio/hooks/useBridgeURL';

export type SyncInfoModalProps = {
  isOpen: boolean;
  toggleOpen: () => void;
};

const novuEndpointPlaceholder = '<YOUR_NOVU_ENDPOINT_URL>';

export const SyncInfoModal: FC<SyncInfoModalProps> = ({ isOpen, toggleOpen }) => {
  const { apiKey } = useApiKeysPage();
  const bridgeUrl = useBridgeURL();

  const tabs = [
    {
      value: 'github',
      label: 'GitHub Actions',
      content: (
        <Prism withLineNumbers language="yaml">
          {getGithubYamlContent({ apiKey, bridgeUrl })}
        </Prism>
      ),
    },
    {
      value: 'other',
      label: 'CLI',
      content: (
        <Prism withLineNumbers language="bash">
          {getOtherCodeContent({ apiKey, bridgeUrl })}
        </Prism>
      ),
    },
  ];

  return (
    <Modal
      opened={isOpen}
      title={
        <>
          <Title variant="section">Sync changes to the Environment</Title>
          <Text variant="secondary">Run the following command to publish changes to the desired environment:</Text>
        </>
      }
      onClose={toggleOpen}
    >
      <Tabs tabConfigs={tabs} defaultValue={'github'} colorPalette="mode.local" />
    </Modal>
  );
};

function getGithubYamlContent({ apiKey, bridgeUrl }: { apiKey: string; bridgeUrl: string }) {
  return `name: Deploy Workflow State to Novu

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Sync State to Novu
        uses: novuhq/actions-novu-sync@v0.0.4
        with:
          novu-api-key: ${apiKey}
          bridge-url: ${bridgeUrl || novuEndpointPlaceholder}`;
}

function getOtherCodeContent({ apiKey, bridgeUrl }: { apiKey: string; bridgeUrl: string }) {
  return `npx novu-labs@latest sync \\
  --echo-url ${bridgeUrl || novuEndpointPlaceholder} \\
  --api-key ${apiKey}`;
}
