import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { useEffect, useContext } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DataContext } from 'src/store/datacontext/DataContext';
// eslint-disable-next-line import/no-named-as-default
import axiosInstance, { BASE_URL } from 'src/store/apiInterceptors';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
  const { bookingChart, setBookingChart } = useContext(DataContext);
  console.log(bookingChart);
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
      const endOfThisWeek = currentDate.isBefore(weekEnd) ? currentDate : weekEnd; // Lấy đến ngày hiện tại nếu tuần chưa kết thúc
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

  const formattedLabelDayMonth = formattedLabels.map((week) => {
    const startFormatted = dayjs(week.start).format('MM/DD');
    const endFormatted = dayjs(week.end).format('MM/DD');
    return `${startFormatted} - ${endFormatted}`;
  });

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
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Weekly Sales"
            total={714000}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Item Orders"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: formattedLabelDayMonth,
              series: [
                {
                  name: 'Paid price',
                  type: 'column',
                  fill: 'solid',
                  data: formattedLabels.map((day) =>
                    // console.log(day);
                    calculateTotalByDay(
                      bookingChart,
                      '',
                      'paid_price',
                      'chart_week',
                      day?.start,
                      day?.end
                    )
                  ),
                },
                {
                  name: 'Original price',
                  type: 'area',
                  fill: 'gradient',
                  data: formattedLabels.map((day) =>
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
                  data: formattedLabels.map((day) =>
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
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
