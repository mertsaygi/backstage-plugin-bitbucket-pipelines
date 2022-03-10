import { BitbucketApi, bitbucketApiRef } from './api';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';


export const bitbucketPipelinesPlugin = createPlugin({
  id: 'bitbucket-pipelines',
  apis: [
    createApiFactory({
      api: bitbucketApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef, configApi: configApiRef },
      factory: ({ configApi }) => {
        return new BitbucketApi({ 
          configApi: configApi,
          workspace: configApi.getString('bitbucket.workspace'), 
        });
      },
    }),
  ],
  routes: {
    explore: rootRouteRef,
  },
});
