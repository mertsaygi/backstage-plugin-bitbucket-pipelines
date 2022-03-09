import { createDevApp } from '@backstage/dev-utils';
import { bitbucketPipelinesPlugin } from '../src/plugin';

createDevApp().registerPlugin(bitbucketPipelinesPlugin).render();
