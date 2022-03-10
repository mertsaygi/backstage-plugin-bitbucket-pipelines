import { Entity } from "@backstage/catalog-model";

export const BITBUCKET_ANNOTATION = 'bitbucket.org/repository-name';

export const isBitbucketAvailable = (entity: Entity) => Boolean(entity.metadata.annotations?.[BITBUCKET_ANNOTATION]);

export const useBitbucketRepoKey = (entity: Entity) => {
    return entity?.metadata.annotations?.[BITBUCKET_ANNOTATION] ?? '';
  };