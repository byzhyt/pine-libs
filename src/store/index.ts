const store: any = createPinia();

import { storePlugin } from 'pinia-plugin-store';
const plugin = storePlugin({
  stores: ['token', 'userInfo', 'config', 'dictList', 'details','Institution'],
  storage: sessionStorage
});
store.use(plugin);
export default store;
