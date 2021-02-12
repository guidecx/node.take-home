import 'module-alias/register';
import 'reflect-metadata';
import '@/config/typeorm';

import app from '@/config/app';

const server = app.listen(3000, () => {
  console.log('  App is running at http://localhost:3000 in %s mode');
  console.log('  Press CTRL-C to stop\n');
});

export default server;
