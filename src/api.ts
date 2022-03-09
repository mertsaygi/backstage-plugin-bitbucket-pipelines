import { Pipeline } from './types';
import { Config } from '@backstage/config';
import { createApiRef } from '@backstage/core-plugin-api';

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
  bitbucketConfig: Config;
};

/**
 * API to talk to Bitbucket.
 */
export class BitbucketApi implements Bitbucket {
  private readonly bitbucketConfig: Config;

  constructor(opts: Options) {
    this.bitbucketConfig = opts.bitbucketConfig;
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
    const workspace = this.bitbucketConfig.getString('workspace');
    const repository = opts.repositoryName;
    const response = await this.fetch<PipelinesResponse>(`/2.0/repositories/${workspace}/${repository}/pipelines/`);

    return response.data;
  }

  private async addAuthHeaders(init: RequestInit): Promise<RequestInit> {
    const bitbucketUsername = this.bitbucketConfig.getString('username');
    const bitbucketPassword = this.bitbucketConfig.getString('appPassword');
    const token = btoa(`${bitbucketUsername}:${bitbucketPassword}`);
    const headers = init.headers || {'Content-Type': 'application/json'};

    return {
      ...init,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    };
  }

}