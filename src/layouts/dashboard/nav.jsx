
/* eslint-disable no-undef */
import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect } from 'react';
import { AiOutlineUp, AiOutlineDown, AiTwotoneSwitcher } from 'react-icons/ai';

import Box from '@mui/material/Box';
import { Fade } from '@mui/material';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig, { navConfigStaff, navConfigManagerProvider } from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');
  const role = localStorage.getItem("role")
  const email = localStorage.getItem('email_role')
  const name = useMemo(() => {
    if (email) {
      const atIndex = email.indexOf('@');

      if (atIndex !== -1) {
        const username = email.slice(0, atIndex);
        return username;
      }
    }
    return '';
  }, [email]);
  const [dataNav, setDataNav] = useState([])
  const [expanded, setExpanded] = useState({});
  const toggleContentVisibility = (field) => {
    setExpanded((prevExpanded) => {
      const newExpanded = { ...prevExpanded };

      if (newExpanded[field]) {
        newExpanded[field] = false;
      } else {
        newExpanded[field] = true;
        Object.keys(newExpanded).forEach((key) => {
          if (key !== field) {
            newExpanded[key] = false;
          }
        });
      }
      return newExpanded;
    });
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname,]);

  useEffect(() => {
    if (role === "Admin") {
      setDataNav(navConfig)
    }
    if (role === "Staff") {
      setDataNav(navConfigStaff)
    }
  }, [onCloseNav, openNav, pathname, role, email])
  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {role}
        </Typography>
      </Box>
    </Box>
  );
  const pathManagement = navConfigManagerProvider?.some((item) => pathname === item.path);


  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {dataNav.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
      <ListItemButton
        component={RouterLink}
        sx={{
          position: "relative",
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(pathManagement && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
          ...(pathManagement && {
            color: 'primary.main',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          })
        }}
        onClick={() => toggleContentVisibility("provider")}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <AiTwotoneSwitcher className='w-6 h-6' />
        </Box>
        <Box component="span">Provider Management</Box>

        {!expanded?.provider ? (
          <AiOutlineDown className='absolute right-4' />
        ) : (
          <AiOutlineUp className='absolute right-4' />
        )}
      </ListItemButton>
      {navConfigManagerProvider?.map((item, index) => {
        const activeProvider = pathname === item?.path;
        return (
          <React.Fragment key={index}>


            {expanded?.provider && (
              <Fade in={expanded} timeout={700}>
                <ListItemButton
                  component={RouterLink}
                  href={item?.path}
                  sx={{
                    position: "relative",
                    minHeight: 44,
                    borderRadius: 0.75,
                    paddingLeft: 7,
                    typography: 'body2',
                    color: 'text.secondary',
                    textTransform: 'capitalize',
                    fontWeight: 'fontWeightMedium',
                    ...(activeProvider && {
                      color: 'primary.main',
                      fontWeight: 'fontWeightSemiBold',
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[300]),
                      },
                    }),
                  }}
                >
                  <span>{item?.title}</span>
                </ListItemButton>
              </Fade>
            )}
          </React.Fragment>
        )
      })}




    </Stack>
  );



  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}


      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;
  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
