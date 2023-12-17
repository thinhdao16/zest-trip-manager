/* eslint-disable import/no-named-as-default */
import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { CiCircleCheck } from 'react-icons/ci';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { DataContext } from 'src/store/datacontext/DataContext';
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  full_name,
  avatarUrl,
  email,
  phone_number,
  isVerified,
  status,
  handleClick,
  data,
}) {
  const [open, setOpen] = useState(null);
  const { setLoadingAccProvider } = useContext(DataContext);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleEditUser = (dataMenu) => {
    console.log(dataMenu);
    axiosInstance
      .put(`${BASE_URL}/admin/user/${dataMenu.data.id}`, {
        status: dataMenu.status,
      })
      .then((response) => {
        console.log(response);
        setLoadingAccProvider((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const statusMapping = {
    1: { role_name: 'Customer', color: 'success' },
    2: { role_name: 'Admin', color: 'success' },
    3: { role_name: 'Provider', color: 'success' },
    4: { role_name: 'Staff', color: 'success' },
  };
  const currentStatus = statusMapping[phone_number];
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} className="pl-4">
            <Avatar alt={full_name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {full_name || '<No-Name>'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{currentStatus && currentStatus.role_name}</TableCell>

        <TableCell>
          <Label color={(status === 'BANNED' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableRow>
          <TableCell align="center">
            {/* Render IconButton only if status is not 4 */}
            {phone_number !== 2 && (
              <IconButton onClick={(e) => handleOpenMenu(e, data)}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </TableCell>
          {/* Other TableCell components */}
        </TableRow>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        {/* {status !== 'SUSPENDED' && (
          <MenuItem onClick={() => handleEditUser({ data, status: "SUSPENDED" })}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Suspended
          </MenuItem>
        )} */}
        {status !== 'BANNED' && (
          <MenuItem
            onClick={() => handleEditUser({ data, status: 'BANNED' })}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Banned
          </MenuItem>
        )}

        {status !== 'ACTIVE' && (
          <MenuItem
            onClick={() => handleEditUser({ data, status: 'ACTIVE' })}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:check-2-outline" sx={{ mr: 2 }} />
            <CiCircleCheck className="mr-5 ml-1" />
            Active
          </MenuItem>
        )}
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  full_name: PropTypes.any,
  phone_number: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  data: PropTypes.any,
};
