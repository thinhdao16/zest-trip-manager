import { SlDrawer } from "react-icons/sl";
import { AiOutlineGlobal } from 'react-icons/ai';
import { MdOutlineTour, MdOutlineRateReview } from "react-icons/md";

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Provider statistic',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),

  },
  {
    title: 'review',
    path: '/list-review',
    icon: <MdOutlineRateReview className='w-6 h-6' />,
  },
  {
    title: 'Global',
    path: '/global',
    icon: <AiOutlineGlobal className='w-6 h-6' />,
  },
  {
    title: 'Tour Provider',
    path: '/list-provider-tour',
    icon: <MdOutlineTour className='w-6 h-6' />,
  },

];
export const navConfigStaff = [
  {
    title: 'Provider statistic',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'review',
    path: '/list-review',
    icon: icon('ic_user'),
  },
  {
    title: 'Global',
    path: '/global',
    icon: icon('ic_user'),
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
  {
    title: 'Provider Withdraw',
    path: '/list-provider-withdraw',
    icon: <SlDrawer className='w-6 h-6' />,
  },
];

export default navConfig;
