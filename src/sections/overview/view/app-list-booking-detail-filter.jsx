/* eslint-disable jsx-a11y/no-static-element-interactions */
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useContext } from 'react';

import { formatNumber } from 'src/utils/formatNumber';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

/* eslint-disable jsx-a11y/click-events-have-key-events */

function ListPaymentFilterDate() {
  const [expandedItems, setExpandedItems] = useState({});
  const [provider, setProvider] = useState({})
  const { indexPid } = useParams();
  const { bookingChart, setBookingChart } = useContext(DataContext);
  const filteredBookings = bookingChart?.filter(
    (booking) =>
      booking.status !== 'REJECT' && booking.status !== 'PENDING' && booking.status !== '0'
  );

  const filteredBookingByDate = useMemo(() => {
    const startDate = localStorage.getItem('dateNaviStart');
    const endDate = localStorage.getItem('dateNaviEnd');

    return filteredBookings?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at).format('YYYY-MM-DD');
      const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
      return bookedDate >= formattedStartDate && bookedDate <= formattedEndDate;
    });
  }, [filteredBookings]);

  const filterBookingsByProviderId = (bookings, providerId) =>
    bookings?.filter((booking) => {
      const bookingProviderId = booking?.BookingOnTour?.Provider?.id;
      return bookingProviderId === providerId;
    });
  const bookingChartPid = filterBookingsByProviderId(filteredBookingByDate, indexPid);
  console.log(bookingChartPid);
  const toggleContentVisibility = (index) => {
    const newExpandedItems = { ...expandedItems };
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  const totalProviderReceive = bookingChartPid.reduce((total, booking) => {
    const providerReceiveAmount = parseFloat(booking.provider_receive) || 0;
    return total + providerReceiveAmount;
  }, 0);
  const totalPaidOriginal = bookingChartPid.reduce((total, booking) => {
    const providerReceiveAmount = parseFloat(booking.original_price) || 0;
    return total + providerReceiveAmount;
  }, 0);
  const totalRefundAmount = bookingChartPid.reduce((total, booking) => {
    const providerReceiveAmount = parseFloat(booking.refund_ammount) || 0;
    return total + providerReceiveAmount;
  }, 0);

  useEffect(() => {
    axiosInstance
      .post(`${BASE_URL}/booking/owned`, {
        select: '500',
      })
      .then((response) => {
        setBookingChart(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    axiosInstance
      .get(`${BASE_URL}/staff/provider-management/providers/${indexPid}`,)
      .then((response) => {
        setProvider(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [indexPid, setBookingChart]);
  return (
    <>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <main className="h-ful overflow-auto global-scrollbar rounded-lg">
        <div className="container mx-auto py-4 px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold ">Payment statistics</h1>
              <span className="text-gray-500">
                The total monetary value of all transactions conducted within the defined timeframe.
              </span>
            </div>
          </div>
          <div />

          <div className=' bg-white p-4 rounded-md shadow-custom-card-mui relative grid grid-cols-12'>
            <div className="col-span-7">
              <div className='flex items-center gap-3'>
                <img src={provider?.avatar_image_url} alt="" className='w-20 h-20 rounded-md shadow-custom-card-mui' />
                <div className=''>
                  <p>{provider?.company_name}</p>
                  <span>{provider?.email}</span>
                  <div>
                    <span>{provider?.address_name}</span>,{" "}
                    <span>{provider?.address_ward}</span>,{" "}
                    <span>{provider?.address_district}</span>,{" "}
                    <span>{provider?.address_province}</span>,{" "}
                    <span>{provider?.address_country}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-5">
              <div className="grid grid-cols-2">
                <div className='flex flex-col gap-2'>
                  <span className='font-medium'>Total paid original:</span>
                  <span className='font-medium'>Total provider received:</span>
                  <span className='font-medium'>Total refund amount:</span>

                </div>
                <div className='flex flex-col gap-2'>
                  <span className='ml-3'>{formatNumber(totalPaidOriginal)}</span>
                  <span className='ml-3'>{formatNumber(totalProviderReceive)}</span>
                  <span className='ml-3'>{formatNumber(totalRefundAmount)}</span>
                </div>
              </div>

            </div>
          </div>
          <div className="text-lg font-medium pb-2"> Payment history</div>
          <div className="container flex flex-col gap-4">
            <div className="bg-white p-3 rounded-lg shadow-custom-card-mui">
              <div className="grid grid-cols-4 gap-3">
                <div className="">
                  <span className="font-medium">Info</span>
                </div>
                <div className="">
                  <span className="font-medium">Paid original</span>
                </div>
                <div className="">
                  <span className="font-medium">Provider received</span>
                </div>
                <div className="">
                  <span className="font-medium">Refund amount</span>
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-2">
              {bookingChartPid?.length > 0 ? (
                (bookingChartPid)
                  .sort((a, b) => dayjs(b.updated_at).diff(dayjs(a.updated_at)))
                  .map((dataVoucher, index) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div key={index} className="shadow-custom-card-mui bg-white rounded-lg relative">
                      <div className=" px-4 py-6 relative ">
                        <div
                          className="grid grid-cols-4 gap-3 "
                          onClick={() => toggleContentVisibility(index)}
                        >
                          <div className=" flex items-center ">
                            <div className=" flex flex-col">
                              <span className="">{dataVoucher?.booker_email}</span>
                              <span>{dayjs(dataVoucher?.updated_at).format('YYYY-MM-DD')}</span>
                            </div>
                          </div>
                          <div className=" flex items-center ">
                            <span className="">
                              {formatNumber(parseInt(dataVoucher?.original_price || {}, 10), 10)}
                            </span>
                          </div>
                          <div className=" flex items-center ">
                            <div className="flex flex-wrap gap-3">
                              <span className="">
                                {formatNumber(parseInt(dataVoucher?.provider_receive || {}, 10))}
                              </span>
                            </div>
                          </div>
                          <div className=" flex items-center">
                            <div className="flex flex-wrap gap-3">
                              <span className="">
                                {formatNumber(parseInt(dataVoucher?.refund_ammount || {}, 10))}
                              </span>
                            </div>
                          </div>
                          <div className=" flex items-center">
                            {/* <StatusBooking>{dataVoucher?.status}</StatusBooking>
                           */}
                            <span>
                              {/* {
                              sumBookingInWeek(
                                bookingChartPid,
                                dataVoucher?.label?.start,
                                dataVoucher?.label?.end
                              )?.length
                            } */}
                            </span>
                          </div>
                        </div>
                      </div>

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
      </main>
    </>
  );
}

export default ListPaymentFilterDate;
