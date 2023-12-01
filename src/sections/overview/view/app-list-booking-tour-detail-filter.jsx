/* eslint-disable jsx-a11y/no-static-element-interactions */
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect, useContext } from 'react';

import { formatNumber } from 'src/utils/formatNumber';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

/* eslint-disable jsx-a11y/click-events-have-key-events */

function ListPaymentTourFilterDate() {
  const [expandedItems, setExpandedItems] = useState({});
  const { indexPid } = useParams();
  const { bookingChart, setBookingChart } = useContext(DataContext);
  const filteredBookings = bookingChart?.filter(
    (booking) =>
      booking.status !== 'REJECT' && booking.status !== 'PENDING' && booking.status !== '0'
  );

  const filteredBookingByDate = useMemo(() => {
    const startDate = localStorage.getItem('dateNaviTourStart');
    const endDate = localStorage.getItem('dateNaviTourEnd');

    return filteredBookings?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at).format('YYYY-MM-DD');
      const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
      return bookedDate >= formattedStartDate && bookedDate <= formattedEndDate;
    });
  }, [filteredBookings]);
  console.log(filteredBookingByDate);

  const filterBookingsByProviderId = (bookings, providerId) =>
    bookings?.filter((booking) => {
      console.log(booking);
      const bookingProviderId = booking?.BookingOnTour?.id;
      return bookingProviderId === providerId;
    });
  const bookingChartPid = filterBookingsByProviderId(filteredBookingByDate, indexPid);
  const toggleContentVisibility = (index) => {
    const newExpandedItems = { ...expandedItems };
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  useEffect(() => {
    axiosInstance
      .post(`${BASE_URL}/booking/owned`, {
        select: '2000',
      })
      .then((response) => {
        setBookingChart(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setBookingChart]);
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
                  <span className="font-medium">Paid price</span>
                </div>
                <div className="">
                  <span className="font-medium">Refund amount</span>
                </div>
                {/* <div className="">
                  <span className="font-medium"> Total </span>
                </div> */}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {bookingChartPid?.length > 0 ? (
                Array.isArray(bookingChartPid) &&
                bookingChartPid?.map((dataVoucher, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div key={index} className="shadow-custom-card-mui bg-white rounded-lg relative">
                    <div className=" px-4 py-6 relative ">
                      {/* {!expandedItems[index] ? (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                          className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                          onClick={() => toggleContentVisibility(index)}
                        >
                          <span>See more</span>
                          <AiOutlineDown />
                        </div>
                      ) : (
                        <div className="absolute bottom-2 right-2 text-xs flex items-center gap-1">
                          <span onClick={() => toggleContentVisibility(index)}>See less</span>
                          <AiOutlineUp />
                        </div>
                      )} */}
                      <div
                        className="grid grid-cols-4 gap-3 "
                        onClick={() => toggleContentVisibility(index)}
                      >
                        <div className=" flex items-center ">
                          <div className=" flex flex-col">
                            <span className="">{dataVoucher?.booker_email}</span>
                            <span>{dayjs(dataVoucher?.booked_date).format('YYYY-MM-DD')}</span>
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
                              {formatNumber(parseInt(dataVoucher?.paid_price || {}, 10))}
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
                    {/* {expandedItems[index] && (
                      <Fade in={expandedItems[index]} timeout={700}>
                        <div>
                          <hr className="mb-4" />
                          {sumBookingInWeek(
                            bookingChartPid,
                            dataVoucher?.label?.start,
                            dataVoucher?.label?.end
                          )?.length > 0 ? (
                            sumBookingInWeek(
                              bookingChartPid,
                              dataVoucher?.label?.start,
                              dataVoucher?.label?.end
                            )?.map((dataBookingInWeek, index) => (
                              <div className=" px-4  mb-4  relative " key={index}>
                                <Link
                                  to={`/list-booking-detail/product/${dataBookingInWeek?.id}`}
                                  key={dataBookingInWeek?.id}
                                >
                                  <IoEye className="absolute top-0 right-2" />
                                </Link>
                                <div className="grid grid-cols-4">
                                  <div>
                                    <p className="">{dataBookingInWeek?.booker_name}</p>
                                    <span>
                                      {dayjs(dataBookingInWeek?.updated_at).format('MM/DD/YYYY')}
                                    </span>
                                  </div>
                                  <div>
                                    <span>{formatNumber(dataBookingInWeek?.original_price)}</span>
                                  </div>
                                  <div>
                                    <span>{formatNumber(dataBookingInWeek?.paid_price)}</span>
                                  </div>
                                  <div>
                                    <span>{formatNumber(dataBookingInWeek?.refund_ammount)}</span>
                                  </div>
                             
                                </div>

                                {index <
                                  sumBookingInWeek(
                                    bookingChartPid,
                                    dataVoucher?.label?.start,
                                    dataVoucher?.label?.end
                                  )?.length -
                                    1 && <hr className="mt-4" />}
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center pb-6 pt-2">
                              <p className="bg-main p-1 rounded-lg shadow-custom-card-mui border border-gray-300 border-solid font-medium">
                                No payment
                              </p>
                            </div>
                          )}
                        </div>
                      </Fade>
                    )} */}
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

export default ListPaymentTourFilterDate;
