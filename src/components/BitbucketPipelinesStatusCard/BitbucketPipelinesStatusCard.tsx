import React, { useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { InfoCard, InfoCardVariants, MissingAnnotationEmptyState } from '@backstage/core-components';
import { BITBUCKET_ANNOTATION, useBitbucketRepoKey } from '../../integrations';
import { useAsync } from 'react-use';
import { Alert as AlertUI } from '@material-ui/lab';
import { bitbucketApiRef } from '../../api';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Pipeline } from '../../types';
import moment from "moment";

type BitbucketPipelinesStatusCardProps = {
    title?: string;
    variant?: InfoCardVariants;
};

const useStyles = makeStyles({
    listItemPrimary: {
        fontWeight: 'bold',
    },
    listItemIcon: {
        minWidth: '1em',
    },
});

const PipelineListItem = ({ pipeline }: { pipeline: Pipeline }) => {
    const classes = useStyles();
    const [pipelineState] = useState({data: pipeline, updatedAt: pipeline.startedAt});

    return (
        <ListItem dense key={pipelineState.data.id}>
            <ListItemText
                primary={pipelineState.data.message}
                primaryTypographyProps={{
                    variant: 'body1',
                    className: classes.listItemPrimary,
                }}
                secondary={
                    <Typography noWrap variant="body2" color="textSecondary">
                        Created {moment(pipelineState.data.startedAt).fromNow()}
                    </Typography>
                }
            />
        </ListItem>
    );
};

const PipelineStatusSummaryTable = ({ pipelines }: { pipelines: Pipeline[] }) => {
    return (
        <List dense>
            {pipelines.map((pipeline, index) => (<PipelineListItem key={pipeline.id + index} pipeline={pipeline} />))}
            {pipelines.length === 0 && <>No recent pipelines</>}
        </List>
    );
};

export const BitbucketPipelinesStatusCard = ({ title, variant }: BitbucketPipelinesStatusCardProps) => {
    const { entity } = useEntity();
    const query = entity.metadata.annotations?.[BITBUCKET_ANNOTATION];

    if (!query) {
        return (
            <MissingAnnotationEmptyState annotation={BITBUCKET_ANNOTATION} />
        );
    }

    const bitbucketApi = useApi(bitbucketApiRef);
    const repoName = useBitbucketRepoKey(entity);
    const { value, loading, error } = useAsync(async () => await bitbucketApi.getPipelines({limit: 3, query: query, repositoryName: repoName}));

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
        <InfoCard title={title || "Bitbucket Pipelines Results"} variant={variant || "gridItem"}>
            <PipelineStatusSummaryTable pipelines={value!} />
        </InfoCard>
    );
};