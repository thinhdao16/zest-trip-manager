import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi';
import { AiFillCheckCircle } from 'react-icons/ai';

import { Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import ModalListReview from '../modal/modal-list-review';
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
  console.log(isVerified)
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleGetInfoProvider = (e) => {
    setOpenModal(true)
  }
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={() => handleGetInfoProvider(idProvider)}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{company}</TableCell>

        <TableCell>
          <Rating name="read-only" value={role} readOnly />
        </TableCell>

        <TableCell className='justify-center items-center' style={{ display: "flex" }}>
          {isVerified === null ? (
            <AiFillCheckCircle className='text-green-500' />
          ) : (
            <FiLoader className='text-yellow-500' />
          )}
        </TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={(e) => handleOpenMenu(e)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* modal */}
      <ModalListReview openModal={openModal} setOpenModal={setOpenModal} idProvider={idProvider} />
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
