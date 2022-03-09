import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const bitbucketPipelinesPlugin = createPlugin({
  id: 'bitbucket-pipelines',
  routes: {
    root: rootRouteRef,
  },
});