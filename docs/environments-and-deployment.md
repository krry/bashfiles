# Environments and Deployments

## Environments
### dev
the development environment

### int
the integration environment
where the code comes together and the integration tests run

### test
the test/QA environment
once integration tests pass, QA does there thing in this environment

### staging
the staging environment
a mirror to production to ensure a stable production environment

### prod
the public-facing environment
maintains the same setup as *staging*

### training
the internal training environment
may contain additional internal-only features

## Environment variables
1. USE_MINIFIED_FILES: true, false
2. PORT: 8100, 443, 80
3. <title>: "FLNL • DEV", "Go Solar • SolarCity"
4. FIREBASE_SECRET: <md5 hash>
5. GMAP_CLIENT: "gme-solarcity"
