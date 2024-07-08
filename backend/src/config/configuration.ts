const nodeEnv: string = 'development';

export default () => ({
  app: {
    nodeEnv,
    port: 3000,
    globalPrefix: 'api',
  },
  database: {
    type: 'postgres' as const,
    url: 'postgres://default:v5yh0pTDPeaQ@ep-sweet-hill-a1hpt8bu.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require',
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  },
  jwt: {
    accessToken: {
      secret: 'accessTokenSecret',
      signOptions: {
        expiresIn: nodeEnv === 'production' ? '30m' : '5y',
      },
    },
    refreshToken: {
      secret: 'refreshTokenSecret',
      signOptions: { expiresIn: '7d' },
    },
    secure: nodeEnv === 'production' ? true : false,
    sameSite: 'lax' as const,
  },
  cloudinary: {
    cloudName: 'dqptawr0n',
    apiKey: '639471335311593',
    apiSecret: 'YvNMCkzN7KdKTq2n_llixDVf8mI',
  },
});
