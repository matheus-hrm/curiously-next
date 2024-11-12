import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({

    server: {
        MONGO_DB_URI: z.string().min(1)
    },
    client: {

    },
    runtimeEnv: {
        MONGO_DB_URI: process.env.MONGO_DB_URI,
    },

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true
})