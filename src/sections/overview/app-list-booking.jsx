/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import dayjs from 'dayjs';
import { useState, useContext } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { AiOutlineUp, AiFillFilter, AiOutlineDown } from 'react-icons/ai';

import { formatNumber } from 'src/utils/formatNumber';

import StatusBooking from 'src/status/booking';
import { DataContext } from 'src/store/datacontext/DataContext';

export function ListBooking() {
  const { bookingChart } = useContext(DataContext);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleContentVisibility = (index) => {
    const newExpandedItems = { ...expandedItems };
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  function calculateTotalByDay(bookings, propertyName, startDate, endDate) {
    const totalByDay = {};

    const recentBookings = bookings?.filter((booking) => {
      const bookedDate = dayjs(booking.updated_at);
      return (
        bookedDate.isAfter(dayjs(startDate), 'day') && bookedDate.isBefore(dayjs(endDate), 'day')
      );
    });

    recentBookings?.forEach((booking) => {
      const dayOfMonth = dayjs(booking.updated_at).format('YYYY-MM-DD');
      const propertyValue = parseInt(booking[propertyName] || '0', 10);
      totalByDay[dayOfMonth] = (totalByDay[dayOfMonth] || 0) + propertyValue;
    });

    return totalByDay;
  }

  function calculateWeeks() {
    const currentDate = dayjs();
    const currentDayOfWeek = currentDate.day();

    const thisSunday = currentDate.subtract(currentDayOfWeek, 'day');

    const weeks = Array.from({ length: 7 }, (_, weekIndex) => {
      const weekStart = thisSunday.subtract(weekIndex, 'week');
      const weekEnd = weekStart.add(6, 'day');
      return { start: weekStart.format('YYYY-MM-DD'), end: weekEnd.format('YYYY-MM-DD') };
    });

    return weeks.reverse();
  }

  const lableWeeks = calculateWeeks();

  const calculateChartData = (chart, paidField, originalField, refundField) =>
    lableWeeks.map((week) => {
      const paid = calculateTotalByDay(chart, paidField, week.start, week.end);
      const original = calculateTotalByDay(chart, originalField, week.start, week.end);
      const refund = calculateTotalByDay(chart, refundField, week.start, week.end);
      const formattedLabel = `${dayjs(week.start).format('DD/MM')}-${dayjs(week.end).format(
        'DD/MM/YYYY'
      )}`;
      return {
        label: formattedLabel,
        paid,
        original,
        refund,
      };
    });
  const dataBooking = calculateChartData(
    bookingChart,
    'paid_price',
    'original_price',
    'refund_ammount'
  );
  const sumAllValues = (data) => {
    if (typeof data === 'object' && data !== null) {
      const values = Object.values(data || {});
      console.log(values);
      return values.reduce((sum, value) => sum + value, 0);
    }
    return 0;
  };

  return (
    <div className="h-full bg-main overflow-auto global-scrollbar rounded-lg w-full">
      <div className="container mx-auto py-4 px-8">
        <div className="mb-6 flex items-center justify-between">
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
        </div>

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
                <span className="font-medium">Paid price</span>
              </div>
              <div className="">
                <span className="font-medium">Refund amount</span>
              </div>
              <div className="">
                <span className="font-medium"> Status</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {dataBooking?.length > 0 ? (
              Array.isArray(dataBooking) &&
              dataBooking?.map((dataVoucher, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  className="shadow-custom-card-mui bg-white rounded-lg relative"
                  onClick={() => toggleContentVisibility(index)}
                >
                  <div className=" px-4 py-6 relative ">
                    {!expandedItems[index] ? (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                      <div
                        className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                        onClick={() => toggleContentVisibility(index)}
                      >
                        <span>See tour</span>
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
                          <span className="">{dataVoucher?.label}</span>
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
                        <StatusBooking>{dataVoucher?.status}</StatusBooking>
                      </div>
                    </div>
                  </div>
                  {/* {expandedItems[index] && (
                        <Fade in={expandedItems[index]} timeout={700}>
                          <div>
                            <hr className="mb-4" />
                            {dataVoucher?.tours?.length > 0 ? (
                              dataVoucher?.tours?.map(
                                (voucherTour: any, index: number) => (
                                  <div
                                    className=" px-4  mb-4  relative "
                                    key={index}
                                  >
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={voucherTour?.tour_images[0]}
                                        className="w-12 h-12 rounded-lg"
                                        alt=""
                                      />
                                      <div>
                                        <p className="">{voucherTour?.name}</p>
                                        <p className="text-gray-500">
                                          {voucherTour?.address_district},{" "}
                                          {voucherTour?.address_province},{" "}
                                          {voucherTour?.address_country}
                                        </p>
                                      </div>
                                    </div>

                                    {index <
                                      dataVoucher?.TourVoucher?.length - 1 && (
                                      <hr className="mt-4" />
                                    )}
                                  </div>
                                )
                              )
                            ) : (
                              <div className="flex items-center justify-center pb-6 pt-2">
                                <p className="bg-main p-1 rounded-lg shadow-custom-card-mui border border-gray-300 border-solid font-medium">
                                  Add tour for voucher
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
    </div>
  );
}
