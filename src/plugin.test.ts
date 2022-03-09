import { bitbucketPipelinesPlugin } from './plugin';

describe('bitbucket-pipelines', () => {
  it('should export plugin', () => {
    expect(bitbucketPipelinesPlugin).toBeDefined();
  });
});
