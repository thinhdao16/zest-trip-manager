import { useState } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import { Menu, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, updateData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFilterManagementProvider = (data) => {
    let queryParams = {};

    if (data.length > 0) {
      queryParams = {
        status: data,
      };
    }

    axiosInstance
      .get(`${BASE_URL}/staff/provider-management/providers`, {
        params: queryParams,
      })
      .then((response) => {
        updateData(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search provider..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip>
          <IconButton>

            <Iconify icon="ic:round-filter-list"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />

          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => handleFilterManagementProvider("")}>All</MenuItem>

            <MenuItem onClick={() => handleFilterManagementProvider("PROCESSING")}>Processing</MenuItem>
            <MenuItem onClick={() => handleFilterManagementProvider("ACCEPTED")}>Accepted</MenuItem>
            <MenuItem onClick={() => handleFilterManagementProvider("REJECT")}>Rejected</MenuItem>
            <MenuItem onClick={() => handleFilterManagementProvider("DISABLE")}> Disable </MenuItem>
            <MenuItem onClick={() => handleFilterManagementProvider("BANNED")}>Banned</MenuItem>

          </Menu>
        </Tooltip>
      )}

    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  updateData: PropTypes.any,
};
