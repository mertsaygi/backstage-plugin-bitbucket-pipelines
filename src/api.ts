import { Pipeline } from './types';
import {createApiRef} from '@backstage/core-plugin-api';
import {
  ScmIntegrationRegistry
} from '@backstage/integration';

export const bitbucketApiRef = createApiRef<Bitbucket>({
  id: 'plugin.bitbucket-pipelines.service',
});

type PipelinesFetchOpts = {
  limit?: number;
  query?: string;
  sort?: string;
  order?: string;
  repositoryName: string;
}

export interface Bitbucket {
  getPipelines(opts?: PipelinesFetchOpts): Promise<Pipeline[]>;
}

interface PipelinesResponse {
  data: Pipeline[];
}

type Options = {
  integrations: ScmIntegrationRegistry;
  workspace: string;
};

/**
 * API to talk to Bitbucket.
 */
export class BitbucketApi implements Bitbucket {
  private integrations: ScmIntegrationRegistry;
  private readonly workspace: string;

  constructor(opts: Options) {
    this.workspace = opts.workspace;
    this.integrations = opts.integrations;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const authedInit = await this.addAuthHeaders(init || {});

    const resp = await fetch(`https://api.bitbucket.org${input}`, authedInit);
    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} ${resp.statusText}`);
    }

    return await resp.json();
  }

  async getPipelines(opts: PipelinesFetchOpts): Promise<Pipeline[]> {
    //const limit = opts?.limit || 50;
    const workspace = this.workspace;
    const repository = opts.repositoryName;
    const response = await this.fetch<PipelinesResponse>(`/2.0/repositories/${workspace}/${repository}/pipelines/`);

    return response.data;
  }

  private async addAuthHeaders(init: RequestInit): Promise<RequestInit> {
    const config = this.integrations.bitbucket.byHost('bitbucket.org')!.config;
    const bitbucketUsername = config.username;
    const bitbucketPassword = config.appPassword;
    const token = btoa(`${bitbucketUsername}:${bitbucketPassword}`);
    const headers = init.headers || {'Content-Type': 'application/json'};

    return {
      ...init,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Basic ${token}` } : {}),
      }
    };
  }

}
