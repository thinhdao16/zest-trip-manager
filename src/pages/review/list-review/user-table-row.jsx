import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi';
import { useState, useContext } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';

import { Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

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
  console.log(idProvider)
  const [open, setOpen] = useState(null);
  const { setLoadingAccProvider } = useContext(DataContext)
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleEditUser = (dataMenu) => {
    console.log(dataMenu)
    axiosInstance.put(`${BASE_URL}/staff/review/${idProvider}`, {

      status: dataMenu.status
    })
      .then((response) => {
        console.log(response)
        setLoadingAccProvider((prev) => !prev)
        setOpen(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} >


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

        <TableCell className='' >
          {isVerified === null ? (
            <FiLoader className='text-yellow-500 ml-8' />

          ) : (
            <AiFillCheckCircle className='text-green-500 ml-8' />

          )}
        </TableCell>

        <TableCell>
          <Label color={(status === 'HIDDEN' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={(e) => handleOpenMenu(e)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {/* modal */}
      {/* <ModalListReview openModal={openModal} setOpenModal={setOpenModal} idProvider={idProvider} /> */}
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
        {status !== "PUBLIC" && (
          <MenuItem onClick={() => handleEditUser({ status: "PUBLIC" })}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Public
          </MenuItem>
        )}

        {status !== "HIDDEN" && (
          <MenuItem onClick={() => handleEditUser({ status: "HIDDEN" })} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Hidden
          </MenuItem>
        )}
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
