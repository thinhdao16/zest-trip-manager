import dayjs from 'dayjs';
import { Calendar } from 'react-multi-date-picker';
// import { faker } from '@faker-js/faker';
import { useState, useEffect, useContext } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { LicenseInfo } from '@mui/x-license-pro';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import { ListBooking } from '../app-list-booking';
import AppWebsiteVisits from '../app-website-visits';
// ----------------------------------------------------------------------
LicenseInfo.setLicenseKey("x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e")
export default function AppView() {
  const {
    bookingChart,
    setBookingChart,
    setUser,
    setSaveDateChartChoose,
    setFieldSaveDateChartChoose,
  } = useContext(DataContext);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  const filteredBookings = bookingChart?.filter(
    (booking) =>
      booking.status !== "REJECT" &&
      booking.status !== "PENDING" &&
      booking.status !== "0"
  );

  function calculateTotalByDay(bookings, targetDay, propertyName, field, startDate, endDate) {
    const totalByDay = {};
    const totalByMonth = {};
    const totalByWeek = {};
    if (field === 'chart_day') {
      const recentBookings = bookings?.filter((booking) => {
        const bookedDates = dayjs(booking.updated_at);
        const today = dayjs();
        const diffInDays = today.diff(bookedDates, 'day');
        return diffInDays >= 0 && diffInDays < 7;
      });

      recentBookings?.forEach((booking) => {
        const dayOfWeek = dayjs(booking.updated_at).format('ddd');
        const propertyValue = parseInt(booking[propertyName] || '0', 10);

        if (dayOfWeek === targetDay) {
          totalByDay[targetDay] = (totalByDay[targetDay] || 0) + propertyValue;
        }
      });
      return totalByDay[targetDay] || 0;
    }

    if (field === 'chart_month') {
      const recentBookings = bookings?.filter((booking) => {
        const bookedDates = dayjs(booking.updated_at);
        const tomonth = dayjs();
        const diffInMonths = tomonth.diff(bookedDates, 'month');
        return diffInMonths >= 0 && diffInMonths < 3;
      });

      recentBookings?.forEach((booking) => {
        const monthOfYear = dayjs(booking.updated_at).format('MMM');
        const propertyValue = parseInt(booking[propertyName] || '0', 10);

        if (monthOfYear === targetDay) {
          totalByMonth[targetDay] = (totalByMonth[targetDay] || 0) + propertyValue;
        }
      });

      return totalByMonth[targetDay] || 0;
    }

    if (field === 'chart_week') {
      const recentBookings = bookings?.filter((booking) => {
        const bookedDate = dayjs(booking.updated_at);
        const startDateObj = dayjs(startDate).subtract(1, 'day');
        const endDateObj = dayjs(endDate).add(1, 'day');
        return bookedDate.isAfter(startDateObj, 'day') && bookedDate.isBefore(endDateObj, 'day');
      });

      recentBookings?.forEach((booking) => {
        const dayOfMonth = dayjs(booking.updated_at).format('D');
        const propertyValue = parseInt(booking[propertyName] || '0', 10);
        totalByWeek[dayOfMonth] = (totalByWeek[dayOfMonth] || 0) + propertyValue;
      });

      const total = Object.values(totalByWeek).reduce((acc, value) => acc + value, 0);

      return total;
    }

    return 0;
  }

  function calculateWeeks() {
    const currentDate = dayjs();
    const currentDayOfWeek = currentDate.day();

    const thisSunday = currentDate.subtract(currentDayOfWeek, 'day');

    const weeks = Array.from({ length: 7 }, (_, weekIndex) => {
      const weekStart = thisSunday.subtract(weekIndex, 'week');
      const weekEnd = weekStart.add(6, 'day');
      const endOfThisWeek = currentDate.isBefore(weekEnd) ? currentDate : weekEnd;
      return { start: weekStart, end: endOfThisWeek };
    });

    return weeks.reverse();
  }

  const lableWeeks = calculateWeeks();
  const formattedLabels = lableWeeks.map((week) => {
    const formattedStart = dayjs(week.start).format('YYYY-MM-DD');
    const formattedEnd = dayjs(week.end).format('YYYY-MM-DD');
    return { start: formattedStart, end: formattedEnd };
  });

  const [saveFormattedLabels, setSaveFormattedLabels] = useState(formattedLabels || []);

  const formattedLabelDayMonth = formattedLabels.map((week) => {
    const startFormatted = dayjs(week.start).format('MM/DD');
    const endFormatted = dayjs(week.end).format('MM/DD');
    return `${startFormatted} - ${endFormatted}`;
  });

  const [saveFormattedLabelDayMonth, setSaveFormattedLabelDayMonth] = useState(
    formattedLabelDayMonth || []
  );

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
    axiosInstance
      .get(`${BASE_URL}/admin/user`, {
        params: {
          orderBy: 'email:asc',
        },
      })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setBookingChart, setUser]);

  const handleDateChange = (newDateRange) => {
    const formattedDateRange = newDateRange?.map((date) => {
      const dayjsDate = dayjs(date);
      return dayjsDate.isValid() ? dayjsDate.format('YYYY-MM-DD') : null;
    });

    const [start, end] = formattedDateRange;
    setSelectedDateRange(newDateRange);
    setSaveFormattedLabels([{ start, end }]);
    setSaveFormattedLabelDayMonth([formattedDateRange]);

    setSaveDateChartChoose([{ start, end }]);
    setFieldSaveDateChartChoose('filter');
  };

  const handleChartAll = () => {
    setSaveFormattedLabels([...formattedLabels]);
    setSaveFormattedLabelDayMonth([...formattedLabelDayMonth]);
    setFieldSaveDateChartChoose('normal');
    setSelectedDateRange([null, null]);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Statistic"
            subheader="The last 7 weeks"
            chart={{
              labels: saveFormattedLabelDayMonth,
              series: [
                {
                  name: "Provider revieced",
                  type: 'column',
                  fill: 'solid',
                  data: saveFormattedLabels.map((day) =>
                    calculateTotalByDay(
                      filteredBookings,
                      '',
                      'provider_receive',
                      'chart_week',
                      day && day.start,
                      day && day.end
                    )
                  ),
                },
                {
                  name: 'Original price',
                  type: 'area',
                  fill: 'gradient',
                  data: saveFormattedLabels.map((day) =>
                    calculateTotalByDay(
                      filteredBookings,
                      '',
                      'original_price',
                      'chart_week',
                      day?.start,
                      day?.end
                    )
                  ),
                },
                {
                  name: 'Refund amount',
                  type: 'line',
                  fill: 'solid',
                  data: saveFormattedLabels.map((day) =>
                    calculateTotalByDay(
                      filteredBookings,
                      '',
                      'refund_ammount',
                      'chart_week',
                      day?.start,
                      day?.end
                    )
                  ),
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <div className=" flex flex-col justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="custom-date-range-picker">
                {/* <StaticDateRangePicker
                  slots={{ field: SingleInputDateRangeField }}
                  value={selectedDateRange}
                  onChange={handleDateChange}
                /> */}

              </div>
            </LocalizationProvider>
            <Calendar
              className='py-8 px-5 shadow-none custommer-calendar-chart'
              numberOfMonths={1}
              value={selectedDateRange}
              onChange={handleDateChange}
              range
            >
              <div className="text-center">
                <button
                  className=" p-2 px-2 mt-4 border border-blue-300 rounded-lg"
                  type="button"
                  onClick={() => handleChartAll()}
                >
                  Clear
                </button>
              </div>
            </Calendar>

          </div>
        </Grid>
        <ListBooking />
      </Grid>
    </Container>
  );
}
