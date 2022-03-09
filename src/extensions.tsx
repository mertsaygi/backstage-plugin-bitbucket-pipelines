import { bitbucketPipelinesPlugin } from './plugin';
import { createComponentExtension } from '@backstage/core-plugin-api';


export const EntityBitbucketPipelinesStatusCard = bitbucketPipelinesPlugin.provide(
  createComponentExtension({
    name: 'EntityBitbucketPipelinesStatusCard',
    component: {
      lazy: () => import('./components/BitbucketPipelinesStatusCard').then(m => m.BitbucketPipelinesStatusCard),
    },
  }),
);