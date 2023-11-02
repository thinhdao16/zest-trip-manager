import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'report',
    path: '/report',
    icon: icon('ic_cart'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];
export const navConfigStaff = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'report',
    path: '/report',
    icon: icon('ic_cart'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];
export const navConfigManagerProvider = [
  {
    title: 'List',
    path: '/list-provider',
    icon: icon('ic_user'),
  },
  {
    title: 'Approval',
    path: '/acc-provider',
    icon: icon('ic_user'),
  },
  {
    title: 'Report',
    path: '/report-provider',
    icon: icon('ic_user'),
  },

];
export default navConfig;
