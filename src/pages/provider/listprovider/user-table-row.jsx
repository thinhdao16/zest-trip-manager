import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import ModalListProvider from '../modal/modal-list-provider';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  company,
  role,
  isVerified,
  status,
  handleClick,
  idProvider,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)


  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleGetInfoProvider = (e) => {
    setOpenModal(true)
  }
  const statusColors = {
    BANNED: 'warning',
    REJECT: 'error',
    DISABLE: 'secondary',
    PROCESSING: 'info',
    ACCEPTED: 'success'
  };

  <Label color={statusColors[status] || 'error'}>{status}</Label>

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={() => handleGetInfoProvider(idProvider)}>


        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{company}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell align="center">{isVerified}</TableCell>

        <TableCell>
          <Label color={statusColors[status] || 'error'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          {/* <IconButton onClick={(e) => handleOpenMenu(e)}> */}
          <IconButton >

            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* modal */}
      <ModalListProvider openModal={openModal} setOpenModal={setOpenModal} idProvider={idProvider} />
      {/* end */}
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
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  idProvider: PropTypes.string
};
