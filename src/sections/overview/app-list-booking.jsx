/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import dayjs from 'dayjs';
import { IoEye } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai';

import { Fade } from '@mui/material';

import { formatNumber } from 'src/utils/formatNumber';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

export function ListBooking() {
  const { bookingChart, saveDateChartChoose, fieldSaveDateChartChoose, setAllTour } =
    useContext(DataContext);
  const navigate = useNavigate();
  const filteredBookings = bookingChart?.filter(
    (booking) =>
      booking.status !== 'REJECT' && booking.status !== 'PENDING' && booking.status !== '0'
  );
  const [expandedItems, setExpandedItems] = useState({});

  const [expandedItemTours, setExpandedItemTours] = useState({});

  const toggleContentVisibility = (index) => {
    const newExpandedItems = { ...expandedItems };
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };
  const toggleContentVisibilityTour = (indexDataBook) => {
    const newExpandedItems = { ...expandedItemTours };
    newExpandedItems[indexDataBook] = !newExpandedItems[indexDataBook];
    setExpandedItemTours(newExpandedItems);
  };
  // eslint-disable-next-line consistent-return
  function calculateTotalByDay(bookings, propertyName, startDate, endDate) {
    const totalByDay = {};

    const recentBookings = bookings?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at).format('YYYY-MM-DD');
      const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
      return bookedDate >= formattedStartDate && bookedDate <= formattedEndDate;
    });
    const uniqueTourIdsMap = {};
    recentBookings?.forEach((booking) => {
      const tourId = booking?.tour_id;
      if (!uniqueTourIdsMap[tourId]) {
        uniqueTourIdsMap[tourId] = booking;
      }
    });

    const uniqueTourIds = Object.values(uniqueTourIdsMap);

    if (propertyName === 'tour_id') {
      totalByDay[propertyName] = uniqueTourIds;
      return totalByDay;
    }

    if (propertyName !== 'tour_id') {
      recentBookings?.forEach((booking) => {
        const dayOfMonth = dayjs(booking.updated_at).format('YYYY-MM-DD');
        const propertyValue = parseInt(booking[propertyName] || '0', 10);
        totalByDay[dayOfMonth] = (totalByDay[dayOfMonth] || 0) + propertyValue;
      });
      return totalByDay;
    }
    console.log(totalByDay);
  }

  function calculateWeeks() {
    if (fieldSaveDateChartChoose === 'normal') {
      const currentDate = dayjs();
      const currentDayOfWeek = currentDate.day();
      const thisSunday = currentDate.subtract(currentDayOfWeek, 'day');

      const weeks = Array.from({ length: 7 }, (_, weekIndex) => {
        const weekStart = thisSunday.subtract(weekIndex, 'week');
        const weekEnd = weekStart.add(6, 'day');
        return { start: weekStart.format('YYYY-MM-DD'), end: weekEnd.format('YYYY-MM-DD') };
      });

      return weeks;
    }

    if (fieldSaveDateChartChoose === 'filter') {
      return saveDateChartChoose;
    }

    return null;
  }

  const lableWeeks = calculateWeeks();

  const calculateChartData = (chart, paidField, originalField, refundField) =>
    lableWeeks.map((week) => {
      const paid = calculateTotalByDay(chart, paidField, week.start, week.end);
      const original = calculateTotalByDay(chart, originalField, week.start, week.end);
      const refund = calculateTotalByDay(chart, refundField, week.start, week.end);
      const tour_id = calculateTotalByDay(chart, 'tour_id', week.start, week.end);

      const formatLableTime = {
        start: week.start,
        end: week.end,
      };
      return {
        label: formatLableTime,
        paid,
        original,
        refund,
        tour_id,
      };
    });
  const dataBooking = calculateChartData(
    filteredBookings,
    'provider_receive',
    'original_price',
    'refund_ammount'
  );
  const sumAllValues = (data) => {
    if (typeof data === 'object' && data !== null) {
      const values = Object.values(data || {});
      return values.reduce((sum, value) => sum + value, 0);
    }
    return 0;
  };
  const sumBookingInWeek = (dataBookingWeek, startWeek, endWeek) => {
    const recentBookings = dataBookingWeek?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at).format('YYYY-MM-DD');
      const formattedStartWeek = dayjs(startWeek).format('YYYY-MM-DD');
      const formattedEndWeek = dayjs(endWeek).format('YYYY-MM-DD');

      return bookedDate >= formattedStartWeek && bookedDate <= formattedEndWeek;
    });
    return recentBookings;
  };

  const sumBookingInWeekProvider = (dataBookingWeek, startWeek, endWeek) => {
    const uniqueProvidersMap = new Map();
    const recentBookings = dataBookingWeek?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at);
      const isWithinWeek =
        bookedDate.isAfter(dayjs(startWeek).subtract(1, 'day'), 'day') &&
        bookedDate.isBefore(dayjs(endWeek).add(1, 'day'), 'day');
      if (isWithinWeek) {
        const providerId = booking?.BookingOnTour?.Provider?.id;

        if (providerId && !uniqueProvidersMap.has(providerId)) {
          uniqueProvidersMap.set(providerId, {
            ...booking?.BookingOnTour?.Provider,
          });
        }
      }

      return isWithinWeek;
    });

    const uniqueProviders = Array.from(uniqueProvidersMap.values());
    const totalUniqueProviders = uniqueProviders.length;

    return { recentBookings, uniqueProviders, totalUniqueProviders };
  };
  const handleChooseDate = (id, start, end) => {
    navigate(`/list-booking-detail-filter/${id}`);
    localStorage.setItem('dateNaviStart', start);
    localStorage.setItem('dateNaviEnd', end);
  };
  const handleChooseTourDate = (id, start, end) => {
    navigate(`/list-booking-tour-detail-filter/${id}`);
    localStorage.setItem('dateNaviTourStart', start);
    localStorage.setItem('dateNaviTourEnd', end);
  };
  useEffect(() => {
    axiosInstance
      .get(`${BASE_URL}/tour`, {
        params: {
          limit: '2000',
        },
      })
      .then((response) => {
        setAllTour(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setAllTour]);
  function filterTourSchedulesByIdAndDate(tourSchedules, targetId, startDate, endDate) {
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

    return tourSchedules?.filter((schedule) => {
      const formattedScheduleDate = dayjs(schedule.updated_at).format('YYYY-MM-DD');
      return (
        schedule?.BookingOnTour?.Provider?.id === targetId &&
        formattedScheduleDate >= formattedStartDate &&
        formattedScheduleDate <= formattedEndDate
      );
    });
  }

  function filterToursByProviderId(tours, providerId) {
    console.log(tours);
    return tours?.filter((tour) => tour?.BookingOnTour?.Provider?.id === providerId);
  }
  return (
    <div className="h-full bg-main overflow-auto global-scrollbar rounded-lg w-full">
      <div className="container mx-auto py-4 px-8">
        <div className="text-lg font-medium pb-2"> Payment history</div>
        <div className="container flex flex-col gap-4">
          <div className="bg-white p-3 rounded-lg shadow-custom-card-mui">
            <div className="grid grid-cols-5 gap-3">
              <div className="">
                <span className="font-medium">Date</span>
              </div>
              <div className="">
                <span className="font-medium">Paid original</span>
              </div>
              <div className="">
                <span className="font-medium">Provider recieved</span>
              </div>
              <div className="">
                <span className="font-medium">Refund amount</span>
              </div>
              <div className="">
                <span className="font-medium"> Total </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {dataBooking?.length > 0 ? (
              Array.isArray(dataBooking) &&
              dataBooking?.map((dataVoucher, index) => (
                <div key={index} className="shadow-custom-card-mui bg-white rounded-lg relative">
                  <div className=" px-4 py-6 relative ">
                    {!expandedItems[index] ? (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                      <div
                        className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                        onClick={() => toggleContentVisibility(index)}
                      >
                        <span>See provider</span>
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
                          <span className="">
                            {dayjs(dataVoucher?.label?.start).format('DD/MM')} -{' '}
                            {dayjs(dataVoucher?.label?.end).format('DD/MM/YYYY')}{' '}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-center ">
                        <span className="">
                          {formatNumber(parseInt(sumAllValues(dataVoucher?.original || {}), 10))}
                        </span>
                      </div>
                      <div className=" flex items-center ">
                        <div className="flex flex-wrap gap-3">
                          <span className="">
                            {formatNumber(parseInt(sumAllValues(dataVoucher?.paid || {}), 10))}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-center">
                        <div className="flex flex-wrap gap-3">
                          <span className="">
                            {formatNumber(parseInt(sumAllValues(dataVoucher?.refund || {}), 10))}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-center">
                        <span>
                          {
                            sumBookingInWeek(
                              filteredBookings,
                              dataVoucher?.label?.start,
                              dataVoucher?.label?.end
                            )?.length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedItems[index] && (
                    <Fade in={expandedItems[index]} timeout={700}>
                      <div>
                        <div>
                          <hr className="mb-4" />
                          {sumBookingInWeekProvider(
                            filteredBookings,
                            dataVoucher?.label?.start,
                            dataVoucher?.label?.end
                          )?.uniqueProviders?.length > 0 ? (
                            sumBookingInWeekProvider(
                              filteredBookings,
                              dataVoucher?.label?.start,
                              dataVoucher?.label?.end
                            )?.uniqueProviders?.map((dataBookingInWeek, indexDataBook) => (
                              <div className=" px-4  mb-4  relative " key={indexDataBook}>
                                {!expandedItemTours[indexDataBook] ? (
                                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                                  <div
                                    className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                                    onClick={() => toggleContentVisibilityTour(indexDataBook)}
                                  >
                                    <span>See Tour</span>
                                    <AiOutlineDown />
                                  </div>
                                ) : (
                                  <div className="absolute bottom-2 right-2 text-xs flex items-center gap-1">
                                    <span
                                      onClick={() => toggleContentVisibilityTour(indexDataBook)}
                                    >
                                      See less
                                    </span>
                                    <AiOutlineUp />
                                  </div>
                                )}
                                <IoEye
                                  className="absolute top-0 right-2"
                                  onClick={() =>
                                    handleChooseDate(
                                      dataBookingInWeek?.id,
                                      dataVoucher?.label?.start,
                                      dataVoucher?.label?.end
                                    )
                                  }
                                />

                                <div className="grid grid-cols-5">
                                  <div>
                                    <img
                                      src={dataBookingInWeek?.avatar_image_url}
                                      className="w-14 h-14 rounded-lg"
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <span>{dataBookingInWeek?.email}</span>
                                  </div>
                                  <div>
                                    <span>{dataBookingInWeek?.company_name}</span>
                                  </div>
                                  <div>
                                    <span>{dataBookingInWeek?.phone}</span>
                                  </div>
                                  <div>
                                    <div>
                                      {
                                        filterTourSchedulesByIdAndDate(
                                          filteredBookings,
                                          dataBookingInWeek?.id,
                                          dataVoucher?.label?.start,
                                          dataVoucher?.label?.end
                                        )?.length
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {filterToursByProviderId(
                                    dataVoucher?.tour_id?.tour_id,
                                    dataBookingInWeek?.id
                                  )?.map((dataTourBookingProvider) => {
                                    console.log(dataTourBookingProvider);
                                    return (
                                      <div>
                                        {expandedItemTours[indexDataBook] && (
                                          <Fade in={expandedItemTours[indexDataBook]} timeout={700}>
                                            <div className="px-2 pt-2">
                                              <hr />
                                              <div className="px-2 pt-2 flex items-center gap-3 relative">
                                                <IoEye
                                                  className="absolute top-0 right-2"
                                                  onClick={() =>
                                                    handleChooseTourDate(
                                                      dataTourBookingProvider?.BookingOnTour?.id,
                                                      dataVoucher?.label?.start,
                                                      dataVoucher?.label?.end
                                                    )
                                                  }
                                                />

                                                <img
                                                  src={
                                                    dataTourBookingProvider?.BookingOnTour
                                                      ?.tour_images?.[0]
                                                  }
                                                  className="w-10 h-10 rounded-md"
                                                  alt="error"
                                                />
                                                <span>
                                                  {dataTourBookingProvider?.BookingOnTour?.name}
                                                </span>
                                              </div>
                                            </div>
                                          </Fade>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                {index <
                                  // eslint-disable-next-line no-unsafe-optional-chaining
                                  sumBookingInWeekProvider(
                                    filteredBookings,
                                    dataVoucher?.label?.start,
                                    dataVoucher?.label?.end
                                  )?.uniqueProviders?.length -
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
