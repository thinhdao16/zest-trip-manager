import dayjs from 'dayjs';
// import { faker } from '@faker-js/faker';
import { useState, useEffect, useContext } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

// import Iconify from 'src/components/iconify';

// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
// import AppCurrentVisits from '../app-current-visits';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
// import AppConversionRates from '../app-conversion-rates';

// import '@mui/x-date-pickers/dist/static-date-range-picker.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

import { ListBooking } from '../app-list-booking';
import AppWebsiteVisits from '../app-website-visits';
// ----------------------------------------------------------------------

export default function AppView() {
  const {
    bookingChart,
    setBookingChart,
    setUser,
    setSaveDateChartChoose,
    setFieldSaveDateChartChoose,
  } = useContext(DataContext);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

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
    const formattedDateRange = newDateRange.map((date) => dayjs(date).format('YYYY-MM-DD'));
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
                  name: 'Paid price',
                  type: 'column',
                  fill: 'solid',
                  data: saveFormattedLabels.map((day) =>
                    calculateTotalByDay(
                      bookingChart,
                      '',
                      'paid_price',
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
                      bookingChart,
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
                      bookingChart,
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
          <div className="bg-white flex flex-col justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="custom-date-range-picker">
                <StaticDateRangePicker
                  slots={{ field: SingleInputDateRangeField }}
                  value={selectedDateRange}
                  onChange={handleDateChange}
                />
              </div>
            </LocalizationProvider>
            <div className="text-center">
              <button
                className="mb-2 p-2 px-2 border border-blue-300 rounded-lg"
                type="button"
                onClick={() => handleChartAll()}
              >
                Clear
              </button>
            </div>
          </div>
        </Grid>
        <ListBooking />
      </Grid>
    </Container>
  );
}
