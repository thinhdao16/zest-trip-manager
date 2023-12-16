import { useState, useEffect, useContext } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { generateRowsPerPageOptions } from 'src/utils/generate-rows-per-page';

import { users } from 'src/_mock/user';
import LoadingFullScreen from 'src/loading/LoadingFullScreen';
import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from './table-no-data';
import UserTableRow from './user-table-row';
import UserTableHead from './user-table-head';
import TableEmptyRows from './table-empty-rows';
import UserTableToolbar from './user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';

// ----------------------------------------------------------------------

export default function ListProviderBan() {
  const { loadingAccProvider } = useContext(DataContext);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState({ providers: [] });
  const [loading, setLoading] = useState(false);
  const rowsPerPageOptions = generateRowsPerPageOptions(data?.providers?.length);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: data.providers,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  console.log(dataFiltered)
  const dataFilterNotApp = dataFiltered?.filter((list) => list?.status === "REJECT")
  const notFound = !dataFilterNotApp.length && !!filterName;

  useEffect(() => {
    const queryParams = {
      // orderBy: 'email:asc',
      // status: 'ACTIVE',
      // select: 2,
      // page: 1,
      // query: 'example@example.com',
    };

    axiosInstance
      .get(`${BASE_URL}/staff/provider-management/providers`, {
        params: queryParams,
      })
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [loadingAccProvider]);

  return (
    <>
      {loading ? (
        <LoadingFullScreen loading={loading} />
      ) : (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">List Provider</Typography>
          </Stack>

          <Card>
            <UserTableToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              updateData={setData}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={order}
                    orderBy={orderBy}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleSort}
                    onSelectAllClick={handleSelectAllClick}
                    headLabel={[
                      { id: 'name', label: 'Email' },
                      { id: 'company', label: 'Company' },
                      { id: 'role', label: 'Phone' },
                      { id: 'isVerified', label: 'Service type', align: 'center' },
                      { id: 'status', label: 'Status' },
                      { id: '' },
                    ]}
                  />
                  <TableBody>
                    {dataFilterNotApp
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((row) => (
                        <UserTableRow
                          key={row.id}
                          name={row.email}
                          role={row.phone}
                          status={row.status}
                          company={row.company_name}
                          avatarUrl={row.avatar_image_url}
                          isVerified={row.service_type}
                          selected={selected.indexOf(row.name) !== -1}
                          handleClick={(event) => handleClick(event, row.name)}
                          idProvider={row.id}
                        />
                      ))}

                    <TableEmptyRows
                      height={77}
                      emptyRows={emptyRows(page, rowsPerPage, users.length)}
                    />

                    {notFound && <TableNoData query={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={dataFilterNotApp?.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}
    </>
  );
}
