/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useContext } from 'react';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai';

import { Fade, Popover, MenuItem, IconButton } from '@mui/material';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

function Reported() {
  const { setBookingChart, setProvider, setReport, provider, report } = useContext(DataContext);
  const filteredProviders = provider?.providers?.filter(
    (providers) => providers?.status !== 'PROCESSING' && provider.status !== 'REJECT'
  );

  // Now, `filteredProviders` contains only items with statuses other than "PROCESSING" and "REJECT"

  const [expandedItems, setExpandedItems] = useState({});
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(null);

  const toggleContentVisibility = (index) => {
    const newExpandedItems = { ...expandedItems };
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  function filterByTargetProviderId(arr, targetProviderId) {
    console.log(arr);
    return arr?.filter((item) => item?.targeted_provider_id === targetProviderId);
  }
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleRequest = (id, field) => {
    console.log(id);
    const confirmed = window.confirm('Are you sure you want to update the status?');

    if (confirmed) {
      axiosInstance
        .put(`${BASE_URL}/report/${id}`, {
          status: field,
        })
        .then((response) => {
          console.log(response);
          setLoading((prev) => !prev);
          setOpen(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setOpen(false);
        });
    } else {
      // The user canceled the action
      console.log('Action canceled');
    }
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  useEffect(() => {
    const queryParams = {
      // orderBy: 'email:asc',
      // status: 'PROCESSING',
      // select: 2,
      // page: 1,
      // query: 'example@example.com',
    };

    axiosInstance
      .get(`${BASE_URL}/staff/provider-management/providers`, {
        params: queryParams,
      })
      .then((response) => {
        setProvider(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    axiosInstance
      .get(`${BASE_URL}/report`, {
        params: {
          orderBy: 'email:asc',
        },
      })
      .then((response) => {
        setReport(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setBookingChart, setProvider, setReport, loading]);
  const statusColors = {
    BANNED: 'warning',
    REJECT: 'error',
    DISABLE: 'secondary',
    PROCESSING: 'info',
    ACCEPTED: 'success',
  };
  const getStatusColorClassName = {
    REJECT: 'error',
    PENDING: 'info',
    ACCEPTED: 'success',
  };

  return (
    <div className="h-full bg-main overflow-auto global-scrollbar rounded-lg w-full">
      <div className="container mx-auto py-4 px-8">
        {/* <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold ">Payment method</h1>
            <span className="text-gray-500">When provider have voucher new, they open here</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <RiSearchLine className="absolute top-2 left-2" />
              <input
                type="text"
                name=""
                id=""
                placeholder="Search"
                className="border border-gray-300 pl-8 py-1 w-24 rounded-md"
              />
            </div>
            <div>
              <button
                type="button"
                className="relative bg-white shadow-custom-card-mui border border-gray-300 pl-0 py-1 w-24 rounded-md"
              >
                <AiFillFilter className="absolute top-2 left-2" />
                Filter
              </button>
            </div>
          </div>
        </div> */}

        <div className="text-2xl font-bold pb-8 "> Report Provider</div>
        <div className="container flex flex-col gap-4">
          <div className="bg-white p-3 rounded-lg shadow-custom-card-mui">
            <div className="grid grid-cols-5 gap-3">
              <div className="">
                <span className="font-medium">Email</span>
              </div>
              <div className="">
                <span className="font-medium">Company</span>
              </div>
              <div className="">
                <span className="font-medium">Phone</span>
              </div>
              <div className="">
                <span className="font-medium">Total</span>
              </div>

              <div className="">
                <span className="font-medium"> Status </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filteredProviders?.length > 0 ? (
              Array.isArray(filteredProviders) &&
              filteredProviders?.map((dataProvider, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div key={index} className="shadow-custom-card-mui bg-white rounded-lg relative">
                  <div className=" px-4 py-6 relative ">
                    {!expandedItems[index] ? (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                      <div
                        className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                        onClick={() => toggleContentVisibility(index)}
                      >
                        <span>See report</span>
                        <AiOutlineDown />
                      </div>
                    ) : (
                      <div className="absolute bottom-2 right-2 text-xs flex items-center gap-1">
                        <span onClick={() => toggleContentVisibility(index)}>See less</span>
                        <AiOutlineUp />
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-3 ">
                      <div className=" flex items-center ">
                        <div className="">
                          <span className="">{dataProvider?.email}</span>
                        </div>
                      </div>
                      <div className=" flex items-center ">
                        <span className="">{dataProvider?.company_name}</span>
                      </div>
                      <div className=" flex items-center ">
                        <div className="flex flex-wrap gap-3">
                          <span className="">{dataProvider?.phone}</span>
                        </div>
                      </div>
                      <div className=" flex items-center">
                        <div className="flex flex-wrap gap-3">
                          <span className="">
                            {filterByTargetProviderId(report?.providers, dataProvider?.id)?.length}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-center">
                        {/* <StatusBooking>{dataProvider?.status}</StatusBooking>
                         */}
                        <span>
                          <Label color={statusColors[dataProvider?.status] || 'error'}>
                            {dataProvider?.status}
                          </Label>
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedItems[index] && (
                    <Fade in={expandedItems[index]} timeout={700}>
                      <div>
                        <hr className="" />
                        {filterByTargetProviderId(report?.providers, dataProvider?.id)?.length >
                          0 && (
                          <div className="p-4 bg-slate-100 grid grid-cols-4 mb-4">
                            <span className="font-medium">Email</span>
                            <span className="font-medium">Description</span>{' '}
                            <span className="font-medium">type</span>{' '}
                            <span className="font-medium">Status</span>
                          </div>
                        )}
                        {filterByTargetProviderId(report?.providers, dataProvider?.id)?.length >
                        0 ? (
                          filterByTargetProviderId(
                            report?.providers,
                            dataProvider?.id
                            // eslint-disable-next-line no-shadow
                          )?.map((dataBookingInWeek, index) => (
                            <div className=" px-4  mb-4 py-1  relative " key={index}>
                              <div className="absolute top-0 right-2">
                                <IconButton onClick={(e) => handleOpenMenu(e)}>
                                  <Iconify icon="eva:more-vertical-fill" />
                                </IconButton>
                              </div>
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
                                <MenuItem
                                  onClick={() => handleRequest(dataBookingInWeek?.id, 'ACCEPTED')}
                                >
                                  <Iconify
                                    icon="fluent-mdl2:accept"
                                    className="text-green-500"
                                    sx={{ mr: 2 }}
                                  />
                                  <span className="text-green-500">Accept</span>
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleRequest(dataBookingInWeek?.id, 'REJECT')}
                                  sx={{ color: 'error.main' }}
                                >
                                  <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                                  Reject
                                </MenuItem>
                              </Popover>
                              <div className="grid grid-cols-4">
                                <div>
                                  <span>{dataBookingInWeek?.reporter?.email}</span>
                                </div>
                                <div>
                                  <span>{dataBookingInWeek?.description}</span>
                                </div>
                                <div>
                                  <span>{dataBookingInWeek?.report_type}</span>
                                </div>
                                <div>
                                  <Label
                                    color={
                                      getStatusColorClassName[dataBookingInWeek?.status] || 'error'
                                    }
                                  >
                                    {dataBookingInWeek?.status}
                                  </Label>
                                </div>
                              </div>

                              {index <
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                filterByTargetProviderId(report?.providers, dataProvider?.id)
                                  ?.length -
                                  1 && <hr className="mt-4" />}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center pb-6 pt-2">
                            <p className="bg-main p-1 rounded-lg shadow-custom-card-mui border border-gray-300 border-solid font-medium">
                              No have report
                            </p>
                          </div>
                        )}
                      </div>
                    </Fade>
                  )}
                </div>
              ))
            ) : (
              <button
                type="button"
                className="bg-main rounded-md py-1 px-2 shadow-custom-card-mui font-medium"
              >
                {/* {loading ? "Loading..." : "No tours available"} */}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reported;
