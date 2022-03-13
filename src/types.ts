export interface Pipeline{
    page: number; 
    pagelen: number;
    values: PipelineItem[];
    size: number;
}

export interface PipelineItem {
  type: string; 
  uuid: string;
  repository: RepositoryItem;
  state: StateItem;
  build_number: number;
  creator: string;
  created_on: string;
  completed_on: string;
  target: TargetItem; 
  trigger: TriggerItem;
  run_number: number;
  duration_in_seconds: number;
  build_seconds_used: number;
  first_successful: boolean;
  expired: boolean;
  links: LinksItem;
  has_variables: boolean;
  }
  
  export interface RepositoryItem {

  }
  
  export interface StateItem {

  }
  
  export interface CreatorItem {

  }
  
  export interface TargetItem {

  }
  
  export interface TriggerItem {

  }
  
  export interface LinksItem {

  }