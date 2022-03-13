export interface Config {
    bitbucket: {
        /**
         * Workspace name for Bitbucket Cloud.
         * @visibility frontend
         */
        workspace: string;
        /**
         * Username for Bitbucket Cloud.
         * @visibility frontend
         */
         username: string;
        /**
         * Password for Bitbucket Cloud.
         * @visibility frontend
         */
         appPassword: string;
    }
}