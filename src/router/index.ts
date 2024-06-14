import { routes } from "./router";
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach((from) => {
  from.meta.loading = true;
  return true;
});
router.afterEach((to) => {
  to.meta.loading = true;
  return true;
});
export default router;
