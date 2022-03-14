import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Table, TableColumn } from '@backstage/core-components';
import { InfoCardVariants, MissingAnnotationEmptyState } from '@backstage/core-components';
import { BITBUCKET_ANNOTATION, useBitbucketRepoKey } from '../../integration';
import { useAsync } from 'react-use';
import { Alert as AlertUI } from '@material-ui/lab';
import { bitbucketApiRef } from '../../api';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Pipeline } from '../../types';
import { DateTime } from 'luxon';

type BitbucketPipelinesStatusCardProps = {
    title?: string;
    pageLength?: number;
    variant?: InfoCardVariants;
};

const columns: TableColumn[] = [
    {
      title: 'Pipeline ID',
      field: 'build_number',
    },
    {
      title: 'Commit SHA',
      field: '',
      render: data => {
        const { target } = data as Pipeline;
  
        return target?.commit.hash;
      },
    },
    {
      title: 'Branch',
      field: '',
      render: data => {
        const { target } = data as Pipeline;
  
        return target?.ref_name || "Pull Request";
      },
    },
    {
      title: 'User',
      field: '',
      render: data => {
        const { creator } = data as Pipeline;
  
        return creator.display_name;
      },
    },
    {
      title: 'Status',
      field: '',
      render: data => {
        const { state } = data as Pipeline;
  
        return state.result.name;
      },
    },
    {
      title: 'Started',
      field: 'created_on',
      render: data => {
        const { created_on } = data as Pipeline;
  
        return DateTime.fromISO(created_on).toRelative({ locale: 'en' });
      },
    },
  ];



export const BitbucketPipelinesStatusCard = ({ title, pageLength }: BitbucketPipelinesStatusCardProps) => {
    const pageSize = pageLength || 50;
    const { entity } = useEntity();
    const query = entity.metadata.annotations?.[BITBUCKET_ANNOTATION];

    if (!query) {
        return (
            <MissingAnnotationEmptyState annotation={BITBUCKET_ANNOTATION} />
        );
    }

    const bitbucketApi = useApi(bitbucketApiRef);
    const repoName = useBitbucketRepoKey(entity);
    const { value, loading, error } = useAsync(async () => await bitbucketApi.getPipelines({page: 1, pagelen: pageSize, repositoryName: repoName}));

    if (loading) {
        return <Progress />;
    } else if (error) {
        return (
            <AlertUI data-testid="error-message" severity="error">
                {error.message}
            </AlertUI>
        );
    }
    return (
        <Table
            columns={columns}
            options={{ padding: 'dense', paging: true, search: true, pageSize: pageSize }}
            title={title || "Bitbucket Pipelines Results"}
            page={value?.page}
            totalCount={value?.size}
            data={value?.values!}
        />
    );
};
