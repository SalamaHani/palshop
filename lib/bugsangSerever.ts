import Bugsnag from '@bugsnag/js'

const serverBugsnag = Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY || '',
    releaseStage: process.env.VERCEL_ENV || 'development',
})

export default serverBugsnag;